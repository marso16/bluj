import { getPost, getPosts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
import { SITE_URL } from "@/lib/site";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ShareButton from "@/components/news/ShareButton";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: `${post.title} | BluJ`, description: post.excerpt },
  };
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    ...(post.publishedAt ? { "datePublished": post.publishedAt } : {}),
    ...(post.excerpt ? { "description": post.excerpt } : {}),
    "publisher": { "@type": "Organization", "name": "BluJ", "url": SITE_URL },
    "url": `${SITE_URL}/news/${post.slug.current}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="max-w-2xl mx-auto px-6 py-24">
      <Breadcrumb items={[{ label: "News", href: "/news" }, { label: post.title }]} />

      {post.publishedAt && (
        <time className="text-ghost text-[10px] uppercase tracking-[0.25em]">
          {formatDate(post.publishedAt)}
        </time>
      )}

      <h1 className="font-display font-black text-clean text-5xl md:text-7xl mt-3 mb-10 leading-none">
        {post.title}
      </h1>

      {post.image && (
        <div className="-mx-6 mb-10">
          <img
            src={urlFor(post.image).width(1200).url()}
            alt={post.title}
            className="w-full object-cover max-h-[420px]"
          />
        </div>
      )}

      <div className="h-px bg-glow/20 mb-10" />

      <div className="flex justify-end mb-8">
        <ShareButton title={post.title} url={`${SITE_URL}/news/${post.slug.current}`} />
      </div>

      {post.excerpt && (
        <p className="text-clean text-lg leading-relaxed mb-8 font-medium">{post.excerpt}</p>
      )}

      {post.body && (
        <div className="text-ghost leading-relaxed whitespace-pre-wrap">{post.body}</div>
      )}
    </div>
    </>
  );
}
