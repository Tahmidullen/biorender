"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [checking, setChecking] = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  // If the user is already logged in, skip the login page entirely
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/dashboard");
      else setChecking(false);
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 32, height: 32,
          border: "4px solid #14b8a6", borderTopColor: "transparent",
          borderRadius: "50%", animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 50%, #eff6ff 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 16px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{
              width: 38, height: 38, background: "#14b8a6", borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: "bold", color: "#fff", fontSize: 18,
            }}>B</div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>BioRender</span>
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff", borderRadius: 18,
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          border: "1px solid #f3f4f6", padding: "36px 32px",
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "#0d9488", fontWeight: 600, textDecoration: "none" }}>
              Sign up free
            </Link>
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Email">
              <input
                type="email" required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </Field>

            <Field label="Password">
              <input
                type="password" required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                style={inputStyle}
              />
            </Field>

            {error && <ErrorBox message={error} />}

            <button type="submit" disabled={loading} style={submitStyle(loading)}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div style={{
      fontSize: 13, color: "#ef4444",
      background: "#fef2f2", border: "1px solid #fecaca",
      borderRadius: 8, padding: "10px 14px",
    }}>
      {message}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "10px 14px", fontSize: 14,
  border: "1.5px solid #e5e7eb", borderRadius: 10,
  outline: "none", background: "#f9fafb",
  transition: "border-color 0.15s",
};

function submitStyle(loading: boolean): React.CSSProperties {
  return {
    width: "100%", padding: "11px",
    background: loading ? "#99f6e4" : "#14b8a6",
    color: "#fff", border: "none", borderRadius: 10,
    fontSize: 14, fontWeight: 700, cursor: loading ? "default" : "pointer",
    transition: "background 0.15s",
  };
}
