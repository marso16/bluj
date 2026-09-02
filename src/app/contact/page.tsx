import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with BluJ. Questions, feedback, or anything else. We're listening.",
  openGraph: { title: "Contact BluJ", description: "Questions or feedback? Reach out to the BluJ team." },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <p className="text-ghost text-[11px] uppercase tracking-[0.2em] mb-3">
        Get In Touch
      </p>
      <h1 className="font-display font-black text-clean text-6xl md:text-7xl mb-4 leading-none">
        Contact
      </h1>
      <p className="text-ghost mb-12 leading-relaxed">
        Questions, feedback, or anything else. We're listening.
      </p>
      <ContactForm />
    </div>
  );
}
