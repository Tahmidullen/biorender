export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {children}
    </div>
  );
}
