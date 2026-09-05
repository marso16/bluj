"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ background: "#0A0E1A", margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <p style={{ color: "#F59E0B", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>
              Critical error
            </p>
            <h1 style={{ color: "#F0F4FF", fontSize: "72px", fontWeight: 900, lineHeight: 1, margin: "0 0 24px" }}>
              Oops
            </h1>
            <p style={{ color: "#8892A4", fontSize: "14px", lineHeight: 1.6, marginBottom: "32px" }}>
              The page crashed unexpectedly. We're sorry about that.
            </p>
            <button
              onClick={reset}
              style={{ background: "#1D6FFF", color: "#0A0E1A", border: "none", padding: "12px 24px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
