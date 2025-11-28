import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { FileText, Image as ImageIcon, File as FileIcon, FileType } from "lucide-react";

function mimeFromDataUrl(dataUrl?: string): string | null {
  if (!dataUrl?.startsWith("data:")) return null;
  const head = dataUrl.slice(5).split(";")[0];
  return head || null;
}

interface FilePreviewProps {
  file?: File;
  dataUrl?: string; // fallback for when you only have a base64 data URL
  className?: string;
  filename?: string;
  height?: number; // px height for frame
}

export function FilePreview({
  file,
  dataUrl,
  className = "",
  filename,
  height = 384, // 24rem ~ max-h-96
}: FilePreviewProps) {
  const inferredMime = file?.type || mimeFromDataUrl(dataUrl) || "";
  const isImage = inferredMime.startsWith("image/");
  const isPdf = inferredMime === "application/pdf";
  const isText = inferredMime.startsWith("text/") || inferredMime === "application/json";

  // Create object URL for File (better perf than big data URLs)
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const src = objectUrl ?? dataUrl ?? "";

  // Simple text snippet (only when File is available)
  const [textSnippet, setTextSnippet] = useState<string>("");
  useEffect(() => {
    let ignore = false;
    const loadText = async () => {
      if (file && isText) {
        try {
          const text = await file.text();
          if (!ignore) setTextSnippet(text.slice(0, 4000));
        } catch {
          if (!ignore) setTextSnippet("");
        }
      } else {
        setTextSnippet("");
      }
    };
    void loadText();
    return () => {
      ignore = true;
    };
  }, [file, isText]);

  // Renderers
  if (isImage && src) {
    return (
      <img
        src={src}
        alt={filename || "Preview"}
        className={`rounded-md w-full object-contain border ${className}`}
        style={{ maxHeight: height }}
      />
    );
  }

  if (isPdf && src) {
    // Note: Some Android WebViews don't render PDFs in iframes. Provide an "Open" button fallback.
    return (
      <div className={`relative ${className}`}>
        <iframe
          title="PDF Preview"
          src={src}
          className="w-full rounded-md border"
          style={{ height }}
        />
        <div className="mt-2 flex justify-end">
          <Button type="button" variant="outline" onClick={() => window.open(src, "_blank")}>
            Open PDF
          </Button>
        </div>
      </div>
    );
  }

  if (isText && textSnippet) {
    return (
      <Card className={`p-3 border ${className}`} style={{ maxHeight: height, overflow: "auto" }}>
        <div className="flex items-center gap-2 mb-2 text-[#312E81]">
          <FileText className="h-4 w-4" />
          <span className="text-sm font-medium">{filename || file?.name || "Text file"}</span>
        </div>
        <pre className="text-sm whitespace-pre-wrap">{textSnippet}</pre>
      </Card>
    );
  }

  const Icon =
    inferredMime.startsWith("image/") ? ImageIcon :
    inferredMime ? FileType : FileIcon;

  return (
    <Card className={`p-4 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-[#312E81]" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {filename || file?.name || "Document"}
          </span>
          <span className="text-xs text-[#4C4799]">{inferredMime || "Unknown type"}</span>
        </div>
      </div>
      {src && (
        <Button type="button" variant="outline" onClick={() => window.open(src, "_blank")}>
          Open
        </Button>
      )}
    </Card>
  );
}