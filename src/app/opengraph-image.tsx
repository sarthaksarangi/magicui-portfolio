import { DATA } from "@/data/resume";
import { ImageResponse } from "next/og";

export const alt = `${DATA.name} – ${DATA.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0a0a0a",
          color: "#fafafa",
        }}
      >
        <div style={{ fontSize: 34, color: "#a1a1aa" }}>
          {DATA.url.replace("https://", "")}
        </div>
        <div style={{ fontSize: 92, fontWeight: 700, marginTop: 20 }}>
          {DATA.name}
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#60a5fa" }}>
          {DATA.title}
        </div>
        <div style={{ fontSize: 32, color: "#a1a1aa", marginTop: 36 }}>
          {DATA.description}
        </div>
      </div>
    ),
    size
  );
}
