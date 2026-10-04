import { ImageResponse } from "next/og";

export const alt = "SmileCare Dental Clinic — Healthy smiles start with care you can trust.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "linear-gradient(135deg, #0a1f3c 0%, #112b50 55%, #144f4c 100%)",
        color: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 24,
            background: "linear-gradient(135deg, #43b3a8, #157a73)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
            <path
              strokeLinejoin="round"
              d="M7.5 3C5 3 3.5 5 3.5 7.6c0 1.9.6 3.2 1.1 4.6.6 1.7.8 3.4 1.1 5.4.3 2 .9 3.4 2 3.4 1.2 0 1.5-1.5 1.8-3.2.3-1.8.8-3.3 2.5-3.3s2.2 1.5 2.5 3.3c.3 1.7.6 3.2 1.8 3.2 1.1 0 1.7-1.4 2-3.4.3-2 .5-3.7 1.1-5.4.5-1.4 1.1-2.7 1.1-4.6C20.5 5 19 3 16.5 3c-1.9 0-2.8 1-4.5 1S9.4 3 7.5 3Z"
            />
            <path strokeLinecap="round" d="M8.6 9.2c.9 1.1 2.1 1.7 3.4 1.7s2.5-.6 3.4-1.7" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>SmileCare</span>
          <span style={{ fontSize: 20, letterSpacing: 6, color: "#78cfc5" }}>DENTAL CLINIC</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
          Healthy smiles start with care you can trust.
        </span>
        <span style={{ fontSize: 28, color: "#b5c1d5" }}>
          Implants · Aligners · Root canals · Whitening · Kids dentistry
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26 }}>
        <span style={{ color: "#d9e0eb" }}>Indiranagar, Bengaluru</span>
        <span
          style={{
            display: "flex",
            padding: "14px 30px",
            borderRadius: 999,
            background: "#ffffff",
            color: "#0a1f3c",
            fontWeight: 700,
          }}
        >
          Book an appointment →
        </span>
      </div>
    </div>,
    size,
  );
}
