"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, background: "#f7f8fc", color: "#172033", fontFamily: "Arial, sans-serif" }}>
        <title>Application error | AI-BOS</title>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px", boxSizing: "border-box" }}>
          <section style={{ width: "100%", maxWidth: "560px", border: "1px solid #e2e6ef", borderRadius: "18px", background: "#ffffff", padding: "36px", boxSizing: "border-box", textAlign: "center", boxShadow: "0 18px 50px rgba(32, 45, 76, 0.10)" }}>
            <div aria-hidden="true" style={{ width: "54px", height: "54px", margin: "0 auto", display: "grid", placeItems: "center", borderRadius: "16px", background: "#feecef", color: "#c72f45", fontSize: "24px", fontWeight: 800 }}>!</div>
            <p style={{ margin: "20px 0 0", color: "#c72f45", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Critical application error</p>
            <h1 style={{ margin: "10px 0 0", fontSize: "28px", lineHeight: 1.2, letterSpacing: "-0.03em" }}>AI-BOS couldn’t start correctly</h1>
            <p style={{ margin: "14px auto 0", maxWidth: "440px", color: "#637086", fontSize: "15px", lineHeight: 1.7 }}>Retry the application. If the problem continues, contact support and include the reference shown below.</p>
            <button type="button" onClick={() => unstable_retry()} style={{ minHeight: "44px", marginTop: "24px", border: 0, borderRadius: "10px", background: "#635bff", color: "#ffffff", padding: "0 20px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Retry application</button>
            <p style={{ margin: "18px 0 0", color: "#7b8799", fontSize: "12px" }}>Reference: <code style={{ color: "#172033" }}>{error.digest ?? "GLOBAL-UNAVAILABLE"}</code></p>
          </section>
        </main>
      </body>
    </html>
  );
}
