import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

const FONT_DIR = path.join(
  process.cwd(),
  "node_modules/pretendard/dist/web/static/woff"
);

type Props = {
  title: string;
  description?: string;
};

export async function renderOgImage({ title, description }: Props) {
  const [bold, regular] = await Promise.all([
    readFile(path.join(FONT_DIR, "Pretendard-Bold.woff")),
    readFile(path.join(FONT_DIR, "Pretendard-Regular.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px 80px",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: "#60a5fa",
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 700 }}>{siteConfig.title}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              wordBreak: "keep-all",
            }}
          >
            {title}
          </div>
          {description && (
            <div style={{ fontSize: 30, color: "#a1a1aa", lineHeight: 1.4 }}>
              {description}
            </div>
          )}
        </div>
        <div style={{ fontSize: 24, color: "#71717a" }}>
          {new URL(siteConfig.url).host}
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts: [
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
        { name: "Pretendard", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}
