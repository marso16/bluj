"use client";

import { useState } from "react";

type FormState = { name: string; email: string; message: string };
type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full bg-ink border border-surface px-4 py-3 text-clean placeholder-ghost focus:outline-none focus:border-charge transition-colors duration-200";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border-l-2 border-glow pl-6">
        <p className="font-display font-black text-clean text-3xl leading-tight">
          Message received.
        </p>
        <p className="text-ghost text-sm mt-2">
          We'll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className="text-ghost text-[11px] uppercase tracking-[0.2em] block mb-2">
          Name *
        </label>
        <input
          required
          className={inputClass}
          placeholder="Your name"
          value={form.name}
          onChange={update("name")}
        />
      </div>
      <div>
        <label className="text-ghost text-[11px] uppercase tracking-[0.2em] block mb-2">
          Email *
        </label>
        <input
          required
          type="email"
          className={inputClass}
          placeholder="you@example.com"
          value={form.email}
          onChange={update("email")}
        />
      </div>
      <div>
        <label className="text-ghost text-[11px] uppercase tracking-[0.2em] block mb-2">
          Message *
        </label>
        <textarea
          required
          rows={6}
          className={inputClass}
          placeholder="What's on your mind?"
          value={form.message}
          onChange={update("message")}
        />
      </div>
      {status === "error" && (
        <p className="text-red-400 text-sm border-l-2 border-red-400 pl-4">
          Something went wrong — please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-charge text-clean font-display font-black text-xl uppercase tracking-[0.1em] py-4 hover:bg-charge/80 transition-colors duration-200 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
