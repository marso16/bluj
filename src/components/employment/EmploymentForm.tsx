"use client";

import { useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full bg-ink border border-surface px-4 py-3 text-clean placeholder-ghost focus:outline-none focus:border-charge transition-colors duration-200";

export default function EmploymentForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [cvName, setCvName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("sending");
    try {
      const formData = new FormData(formRef.current);
      const res = await fetch("/api/apply", { method: "POST", body: formData });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border-l-2 border-glow pl-6">
        <p className="font-display font-black text-clean text-3xl leading-tight">
          Application received.
        </p>
        <p className="text-ghost text-sm mt-2">We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} className="space-y-6">
      <div>
        <label className="text-ghost text-[11px] uppercase tracking-[0.2em] block mb-2">Full Name *</label>
        <input required name="name" className={inputClass} placeholder="Jane Smith" />
      </div>
      <div>
        <label className="text-ghost text-[11px] uppercase tracking-[0.2em] block mb-2">Email *</label>
        <input required type="email" name="email" className={inputClass} placeholder="jane@example.com" />
      </div>
      <div>
        <label className="text-ghost text-[11px] uppercase tracking-[0.2em] block mb-2">Phone</label>
        <input type="tel" name="phone" className={inputClass} placeholder="(603) 555-0100" />
      </div>
      <div>
        <label className="text-ghost text-[11px] uppercase tracking-[0.2em] block mb-2">Tell Us About Yourself</label>
        <textarea rows={5} name="message" className={inputClass} placeholder="Any relevant experience, position you're interested in, availability…" />
      </div>

      {/* CV Upload */}
      <div>
        <label className="text-ghost text-[11px] uppercase tracking-[0.2em] block mb-2">
          CV / Resume <span className="text-ghost/50">(optional, PDF or Word)</span>
        </label>
        <label className="flex items-center gap-4 cursor-pointer group">
          <span className="flex-shrink-0 border border-surface group-hover:border-charge/50 text-ghost group-hover:text-clean text-[11px] uppercase tracking-[0.2em] px-5 py-3 transition-colors">
            {cvName ? "Change File" : "Upload File"}
          </span>
          <span className="text-ghost text-sm truncate">
            {cvName ?? "No file chosen"}
          </span>
          <input
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            onChange={(e) => setCvName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
      </div>

      {status === "error" && (
        <p className="text-red-400 text-sm border-l-2 border-red-400 pl-4">
          Something went wrong. Please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-charge text-clean font-display font-black text-xl uppercase tracking-[0.1em] py-4 hover:bg-charge/80 transition-colors duration-200 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Submit Application"}
      </button>
    </form>
  );
}
