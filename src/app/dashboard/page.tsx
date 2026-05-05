"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Figure = {
  id: string;
  title: string;
  preview: string | null;
  updated_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [figures,   setFigures]   = useState<Figure[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    async function init() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { router.push("/login"); return; }

      setUserEmail(userData.user.email ?? null);

      const { data } = await supabase
        .from("figures")
        .select("id, title, preview, updated_at")
        .order("updated_at", { ascending: false });

      setFigures(data ?? []);
      setLoading(false);
    }
    init();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this figure? This cannot be undone.")) return;
    await supabase.from("figures").delete().eq("id", id);
    setFigures((prev) => prev.filter((f) => f.id !== id));
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 36, height: 36, margin: "0 auto 12px",
            border: "4px solid #14b8a6", borderTopColor: "transparent",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ fontSize: 13, color: "#9ca3af" }}>Loading your figures...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>

      {/* ── Top bar ── */}
      <header style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        padding: "0 24px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: "#14b8a6", borderRadius: 9,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "bold", color: "#fff", fontSize: 15,
          }}>B</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>BioRender</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>{userEmail}</span>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 13, color: "#6b7280", background: "none",
              border: "none", cursor: "pointer", fontWeight: 500,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            Log out
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0 }}>My Figures</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
              {figures.length} figure{figures.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <Link
            href="/editor"
            style={{
              background: "#14b8a6", color: "#fff", textDecoration: "none",
              fontWeight: 600, fontSize: 14, padding: "10px 20px",
              borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 6,
            }}
          >
            + New Figure
          </Link>
        </div>

        {/* Empty state */}
        {figures.length === 0 && (
          <div style={{
            background: "#fff", border: "2px dashed #e5e7eb", borderRadius: 16,
            padding: "64px 24px", textAlign: "center",
          }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🧬</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
              No figures yet
            </h2>
            <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 24, maxWidth: 340, margin: "0 auto 24px" }}>
              Create your first scientific figure using the editor. Click Save in the toolbar to store it here.
            </p>
            <Link
              href="/editor"
              style={{
                background: "#14b8a6", color: "#fff", textDecoration: "none",
                fontWeight: 600, fontSize: 14, padding: "10px 24px", borderRadius: 10,
              }}
            >
              Open Editor
            </Link>
          </div>
        )}

        {/* Figures grid */}
        {figures.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}>
            {figures.map((fig) => (
              <FigureCard
                key={fig.id}
                figure={fig}
                onDelete={handleDelete}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Figure card component ──────────────────────────────────────────────────────
function FigureCard({
  figure, onDelete, formatDate,
}: {
  figure: Figure;
  onDelete: (id: string) => void;
  formatDate: (iso: string) => string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 14,
        border: `1.5px solid ${hovered ? "#99f6e4" : "#e5e7eb"}`,
        overflow: "hidden",
        transition: "all 0.15s",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {/* Preview thumbnail */}
      <div style={{
        height: 140, background: "#f3f4f6",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {figure.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={figure.preview}
            alt={figure.title}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <span style={{ fontSize: 36, opacity: 0.3 }}>🧬</span>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "14px 16px" }}>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: "#111827",
          margin: "0 0 4px", whiteSpace: "nowrap",
          overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {figure.title}
        </h3>
        <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 14px" }}>
          Updated {formatDate(figure.updated_at)}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <Link
            href={`/editor?id=${figure.id}`}
            style={{
              flex: 1, textAlign: "center", textDecoration: "none",
              fontSize: 12, fontWeight: 600, color: "#fff",
              background: "#14b8a6", borderRadius: 8, padding: "6px 0",
              transition: "background 0.1s",
            }}
          >
            Open
          </Link>
          <button
            onClick={() => onDelete(figure.id)}
            style={{
              fontSize: 12, fontWeight: 600, color: "#ef4444",
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 8, padding: "6px 12px", cursor: "pointer",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}
