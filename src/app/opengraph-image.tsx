import { ImageResponse } from "next/og";

export const alt = "Agentra — Give AI agents autonomy without giving them unrestricted access.";
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
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(circle at 78% 30%, rgba(160,181,235,0.75) 0%, rgba(246,243,241,0) 45%), radial-gradient(circle at 62% 62%, rgba(255,148,115,0.45) 0%, rgba(246,243,241,0) 40%), #f6f3f1",
          color: "#242424",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, fontFamily: "monospace", letterSpacing: -1 }}>
          agentra
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontFamily: "sans-serif", letterSpacing: -2.1, lineHeight: 1.02 }}>
          <span>Give AI agents autonomy.</span>
          <span style={{ color: "#4e4d4d" }}>Not unrestricted access.</span>
        </div>
        <div style={{ display: "flex", fontSize: 24, fontFamily: "monospace", textTransform: "uppercase", color: "#4e4d4d" }}>
          Local-first · Open source · Nothing leaves your machine
        </div>
      </div>
    ),
    size,
  );
}
