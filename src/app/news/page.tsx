import { getPosts } from "@/lib/sanity/queries";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description: "Latest updates, specials, and news from BluJ locations across NH and VT.",
  openGraph: { title: "News | BluJ", description: "Updates and specials from BluJ." },
};
export const revalidate = 300;

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <p className="text-ghost text-xs uppercase tracking-widest mb-3">From The Pump</p>
      <h1 className="font-display font-black text-clean text-6xl md:text-8xl mb-16 leading-none">
        News
      </h1>

      {posts.length === 0 ? (
        <p className="text-ghost text-sm">No posts yet. Check back soon.</p>
      ) : (
        <div className="flex flex-col gap-px bg-surface/30">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/news/${post.slug.current}`}
              className="bg-ink px-8 py-7 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 hover:bg-surface transition-colors duration-200 group"
            >
              <div className="flex-1">
                <h2 className="font-display font-black text-clean text-2xl md:text-3xl leading-none group-hover:text-glow transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-ghost text-sm mt-3 leading-relaxed line-clamp-2">{post.excerpt}</p>
                )}
              </div>
              <div className="flex-shrink-0 flex flex-col items-start sm:items-end gap-1">
                {post.publishedAt && (
                  <time className="text-ghost text-[10px] uppercase tracking-[0.2em]">
                    {formatDate(post.publishedAt)}
                  </time>
                )}
                <span className="text-charge text-[10px] uppercase tracking-[0.2em]">Read →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
