"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LimitedWidthWrapper from "@/components/limited-width-wrapper";
import { components } from "@/data/stuff";
import { useTranslation } from "react-i18next";
import useIsRTL from "@/hooks/useIsRTL";

export interface ComponentRouteConfig {
  id: string;
}

export default function ComponentRouteProcessor({ id }: ComponentRouteConfig) {
  const router = useRouter();
  const { t } = useTranslation();
  const isRTL = useIsRTL();

  const meta = components.find((c) => c.id === id);

  useEffect(() => {
    if (!meta) {
      router.replace("/");
    }
  }, [meta, router]);

  if (!meta) return null;

  const title = t(meta.nameKey);
  const description = t(meta.descriptionKey);
  const tech =
    "techStackKey" in meta && meta.techStackKey ? t(meta.techStackKey) : "";

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(0,0,0,0.45)",
      }}
    >
      <LimitedWidthWrapper
        expandToFull={false}
        maxWidth="1120px"
        paddingDesktop="24px"
        paddingMobile="16px"
      >
        <div
          className="relative rounded-[var(--border-radius)] border"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border-color)",
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            style={{ position: "absolute", top: 12, insetInlineEnd: 12 }}
            className="text-sm text-[var(--sub-foreground)] hover:text-[var(--foreground)]"
          >
            ✕
          </button>

          {/* Header */}
          <div className="px-6 pt-5 pb-3 border-b border-[var(--border-color)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              {title}
            </h2>
            <p className="text-sm text-[var(--sub-foreground)] mt-1">
              {description}
            </p>
            {tech && (
              <p className="text-xs text-[var(--middle-foreground)] mt-1">
                {tech}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col px-6 pb-5 pt-3 gap-3 overflow-y-auto">
            {/* Preview */}
            <section>
              <h3 className="text-sm font-semibold mb-2">Preview</h3>
              <div
                className="rounded-[var(--border-radius)] border"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--background-adjacent-color)",
                  minHeight: "260px",
                }}
              >
                <div className="p-4 text-sm text-[var(--sub-foreground)]">

                </div>
              </div>
            </section>

            {/* Installation */}
            <section>
              <h3 className="text-sm font-semibold mb-2">Installation</h3>
              <pre className="text-xs bg-[var(--code-bg,#111827)] text-[var(--code-fg,#e5e7eb)] rounded-[var(--border-radius)] p-3 overflow-auto">

              </pre>
            </section>

            {/* Code */}
            <section>
              <h3 className="text-sm font-semibold mb-2">Code</h3>
              <FileCodeBlock
                fileName={`${id}.tsx`}
                code={`// Your ${id} component code here`}
              />
            </section>
          </div>
        </div>
      </LimitedWidthWrapper>
    </div>
  );
}

interface FileCodeBlockProps {
  fileName: string;
  code: string;
}

function FileCodeBlock({ fileName, code }: FileCodeBlockProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mb-3 border rounded-[var(--border-radius)] border-[var(--border-color)] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 text-xs bg-[var(--background-adjacent-color)]">
        <span className="font-mono">{fileName}</span>
        <button
          onClick={handleCopy}
          className="text-[var(--accent)] hover:underline"
        >
          Copy
        </button>
      </div>
      <pre className="text-xs bg-[var(--code-bg,#020617)] text-[var(--code-fg,#e5e7eb)] p-3 overflow-auto">

      </pre>
    </div>
  );
}
