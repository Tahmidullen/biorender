"use client";

import EditorToolbar from "@/components/EditorToolbar";

/** Frozen toolbar chrome for the landing-page demo — same component as `/editor`. */
export function HowItWorksDemoToolbar({
  isSaved,
  isSaving,
  exportHighlight,
  savePressPulse = 0,
  exportPressPulse = 0,
}: {
  isSaved: boolean;
  isSaving?: boolean;
  exportHighlight?: boolean;
  savePressPulse?: number;
  exportPressPulse?: number;
}) {
  return (
    <div
      className={
        exportHighlight
          ? "[&_button:last-child]:ring-2 [&_button:last-child]:ring-primary/50"
          : undefined
      }
    >
      <EditorToolbar
        title="Cell layout"
        onTitleChange={() => {}}
        isSaving={isSaving ?? false}
        isSaved={isSaved}
        onSave={() => {}}
        onAddText={() => {}}
        onDelete={() => {}}
        onColorChange={() => {}}
        onDownload={() => {}}
        onClear={() => {}}
        savePressPulse={savePressPulse}
        exportPressPulse={exportPressPulse}
      />
    </div>
  );
}
