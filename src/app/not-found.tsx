import Link from "next/link";

// Next.js automatically uses this file for any route that doesn't exist
export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#f9fafb", padding: "24px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 72, marginBottom: 8 }}>🧬</div>
      <h1 style={{ fontSize: 80, fontWeight: 900, color: "#e5e7eb", margin: "0 0 4px", lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>
        Page not found
      </h2>
      <p style={{ fontSize: 14, color: "#6b7280", maxWidth: 360, lineHeight: 1.6, margin: "0 0 28px" }}>
        Looks like this cell didn&apos;t differentiate the way we expected.
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link
          href="/"
          style={{
            background: "#14b8a6", color: "#fff", textDecoration: "none",
            fontWeight: 700, fontSize: 14, padding: "10px 22px", borderRadius: 10,
          }}
        >
          Go Home
        </Link>
        <Link
          href="/dashboard"
          style={{
            background: "#f3f4f6", color: "#374151", textDecoration: "none",
            fontWeight: 700, fontSize: 14, padding: "10px 22px", borderRadius: 10,
            border: "1px solid #e5e7eb",
          }}
        >
          My Dashboard
        </Link>
      </div>
    </div>
  );
}
