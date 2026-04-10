"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');`}</style>
      <div style={{ textAlign: "center", maxWidth: 400, padding: 40 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Sales Dashboard</div>
        <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 32 }}>Sign in with your Pylon Google account</div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#dc2626" }}>
            {error === "AccessDenied"
              ? "Access denied. Only @usepylon.com emails are allowed."
              : "Something went wrong. Please try again."}
          </div>
        )}

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "12px 28px", borderRadius: 10,
            background: "#fff", border: "1px solid #e2e8f0",
            fontSize: 15, fontWeight: 600, color: "#0f172a",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            transition: "all 0.15s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Sign in with Google
        </button>

        <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 24 }}>Restricted to @usepylon.com accounts</div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f8fafc" }} />}>
      <LoginContent />
    </Suspense>
  );
}
