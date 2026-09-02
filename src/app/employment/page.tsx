import type { Metadata } from "next";
import EmploymentForm from "@/components/employment/EmploymentForm";
import { getJobPostings } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Employment",
  description: "Join the BluJ team. We're hiring across New Hampshire and Vermont. Full-time, part-time, and seasonal positions available.",
  openGraph: { title: "Work at BluJ", description: "Join the BluJ team across NH and VT." },
};

export const revalidate = 60;

const TYPE_LABEL: Record<string, string> = {
  "full-time": "Full-Time",
  "part-time": "Part-Time",
  seasonal: "Seasonal",
};

export default async function EmploymentPage() {
  const jobs = await getJobPostings();

  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <p className="text-ghost text-[11px] uppercase tracking-[0.2em] mb-3">
        Join The Team
      </p>
      <h1 className="font-display font-black text-clean text-6xl md:text-7xl mb-4 leading-none">
        Work With Us
      </h1>
      <p className="text-ghost mb-12 leading-relaxed">
        BluJ is always looking for motivated people across New Hampshire and
        Vermont. Fill out the form and we'll be in touch.
      </p>

      {jobs.length > 0 && (
        <div className="mb-16">
          <p className="text-ghost text-[11px] uppercase tracking-[0.2em] mb-6">Open Positions</p>
          <div className="flex flex-col gap-px bg-surface/30">
            {jobs.map((job) => (
              <div key={job._id} className="bg-ink px-6 py-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h2 className="font-display font-black text-clean text-2xl leading-none">{job.title}</h2>
                  {job.location && (
                    <p className="text-ghost text-xs mt-1">{job.location}</p>
                  )}
                  {job.description && (
                    <p className="text-ghost text-sm mt-3 leading-relaxed">{job.description}</p>
                  )}
                </div>
                <span className="flex-shrink-0 text-glow text-[10px] uppercase tracking-[0.2em] bg-glow/10 px-3 py-1 self-start sm:self-center whitespace-nowrap">
                  {TYPE_LABEL[job.type] ?? job.type}
                </span>
              </div>
            ))}
          </div>
          <div className="h-px bg-glow/20 mt-px" />
          <p className="text-ghost text-xs mt-4">Apply below. Mention the position you're interested in.</p>
        </div>
      )}

      <EmploymentForm />
    </div>
  );
}
