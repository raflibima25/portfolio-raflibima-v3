import { ImageResponse } from "next/og";

export const runtime = "edge";

async function loadGoogleFont(
  font: string,
  weight: number,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&display=swap`;
  const css = await (
    await fetch(url, { headers: { "User-Agent": "Next.js OG Image" } })
  ).text();

  const match = css.match(/src: url\((.+?)\) format\('truetype'\)/);
  if (!match) throw new Error(`Could not load font: ${font} ${weight}`);

  return await (await fetch(match[1])).arrayBuffer();
}

export async function GET() {
  const [interRegular, interBold] = await Promise.all([
    loadGoogleFont("Inter", 400),
    loadGoogleFont("Inter", 700),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "Inter",
          padding: "60px",
          gap: "56px",
          position: "relative",
        }}
      >
        {/* Background accent */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(251,228,0,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Profile photo */}
        <div
          style={{
            display: "flex",
            flexShrink: 0,
            width: 240,
            height: 240,
            borderRadius: 24,
            border: "4px solid #fbe400",
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(251,228,0,0.25)",
          }}
        >
          <img
            src="https://raflibima.my.id/images/rafli.jpg"
            width={240}
            height={240}
            alt="Rafli Bima Pratandra"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "8px",
            flex: 1,
          }}
        >
          {/* Greeting */}
          <div style={{ fontSize: 20, color: "#888888", fontWeight: 400 }}>
            Hi, I am 👋
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 50,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            Rafli Bima Pratandra
          </div>

          {/* Role */}
          <div
            style={{
              fontSize: 24,
              color: "#fbe400",
              fontWeight: 700,
              marginTop: "2px",
            }}
          >
            Software Engineer · Backend Developer
          </div>

          {/* Divider */}
          <div
            style={{
              width: 72,
              height: 4,
              backgroundColor: "#fbe400",
              borderRadius: 2,
              marginTop: "16px",
              marginBottom: "16px",
              display: "flex",
            }}
          />

          {/* Skills pills */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["Golang", "TypeScript", "Next.js", "gRPC", "PostgreSQL"].map(
              (skill) => (
                <div
                  key={skill}
                  style={{
                    display: "flex",
                    backgroundColor: "rgba(251,228,0,0.1)",
                    border: "1px solid rgba(251,228,0,0.3)",
                    color: "#fbe400",
                    fontSize: 16,
                    fontWeight: 400,
                    padding: "6px 16px",
                    borderRadius: 100,
                  }}
                >
                  {skill}
                </div>
              ),
            )}
          </div>

          {/* Domain */}
          <div
            style={{
              fontSize: 16,
              color: "#555555",
              marginTop: "18px",
            }}
          >
            raflibima.my.id
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400 },
        { name: "Inter", data: interBold, weight: 700 },
      ],
    },
  );
}
