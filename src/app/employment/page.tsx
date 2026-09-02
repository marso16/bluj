import type { Metadata } from "next";
import EmploymentForm from "@/components/employment/EmploymentForm";

export const metadata: Metadata = { title: "Employment | BluJ" };

export default function EmploymentPage() {
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
      <EmploymentForm />
    </div>
  );
}
