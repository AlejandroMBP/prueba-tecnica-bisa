"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import { buildInscripcionUrl, saveLoginEmail } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveLoginEmail(email);
    router.push(buildInscripcionUrl(email));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: "linear-gradient(135deg, #0a1628 0%, #1a2744 40%, #2d0a0a 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif"
    }}>
      {/* Geometric background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large diagonal red accent */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "45%",
          height: "100%",
          background: "linear-gradient(135deg, transparent 0%, rgba(180,20,20,0.12) 100%)",
          clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)"
        }} />
        {/* Gold diagonal line top */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, transparent 0%, #c9a84c 30%, #e8cc7a 50%, #c9a84c 70%, transparent 100%)"
        }} />
        {/* Gold diagonal line bottom */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, transparent 0%, #c9a84c 30%, #e8cc7a 50%, #c9a84c 70%, transparent 100%)"
        }} />
        {/* Subtle dot grid */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(201,168,76,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />
        {/* Blue glow left */}
        <div style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(30,60,160,0.25) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
        {/* Red glow right */}
        <div style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(160,20,20,0.2) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
      </div>

      {/* Header */}
      <header style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 48px",
        borderBottom: "1px solid rgba(201,168,76,0.2)",
        backdropFilter: "blur(10px)",
        background: "rgba(10,22,40,0.4)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{
            background: "white",
            borderRadius: "10px",
            padding: "8px 12px",
            width: "140px",
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,168,76,0.3)"
          }}>
            <Image src="/images/BISA.jpeg" alt="Banco BISA" width={120} height={40} style={{ objectFit: "contain", width: "100%", height: "100%" }} />
          </div>
          {/* Gold divider */}
          <div style={{ width: "1px", height: "36px", background: "linear-gradient(180deg, transparent, #c9a84c, transparent)" }} />
          <div style={{
            background: "white",
            borderRadius: "10px",
            padding: "8px 12px",
            width: "140px",
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,168,76,0.3)"
          }}>
            <Image src="/images/UDR.webp" alt="Universidad del Rosario" width={120} height={40} style={{ objectFit: "contain", width: "100%", height: "100%" }} />
          </div>
        </div>

        {/* Header right: subtle gold text */}
        <div style={{ textAlign: "right" }}>
          <p style={{ color: "rgba(201,168,76,0.7)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
            Hackathon Virtual
          </p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "0.1em", margin: "2px 0 0 0" }}>
            2025
          </p>
        </div>
      </header>

      {/* Main content */}
      <main style={{
        position: "relative",
        zIndex: 10,
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 16px"
      }}>
        <div style={{ width: "100%", maxWidth: "440px" }}>

          {/* White card */}
          <div style={{
            background: "white",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.4)",
            position: "relative"
          }}>

            {/* Gold top bar */}
            <div style={{
              height: "4px",
              background: "linear-gradient(90deg, #1a2744 0%, #c9a84c 30%, #e8cc7a 50%, #c9a84c 70%, #8b1a1a 100%)"
            }} />

            {/* Card top accent area */}
            <div style={{
              background: "linear-gradient(135deg, #0a1628 0%, #1e3a6e 50%, #2d0a0a 100%)",
              padding: "32px 40px 28px",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Decorative corner ornament top-right */}
              <svg style={{ position: "absolute", top: 0, right: 0, opacity: 0.15 }} width="120" height="120" viewBox="0 0 120 120">
                <circle cx="120" cy="0" r="80" fill="none" stroke="#c9a84c" strokeWidth="1" />
                <circle cx="120" cy="0" r="60" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
                <circle cx="120" cy="0" r="40" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
              </svg>
              {/* Decorative corner ornament bottom-left */}
              <svg style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.1 }} width="80" height="80" viewBox="0 0 80 80">
                <circle cx="0" cy="80" r="60" fill="none" stroke="#e8cc7a" strokeWidth="1" />
                <circle cx="0" cy="80" r="40" fill="none" stroke="#e8cc7a" strokeWidth="0.5" />
              </svg>

              {/* Badge */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <span style={{
                  background: "rgba(201,168,76,0.15)",
                  color: "#e8cc7a",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  padding: "6px 20px",
                  borderRadius: "100px",
                  border: "1px solid rgba(201,168,76,0.4)",
                  fontFamily: "'Georgia', serif"
                }}>
                  ✦ Hackathon Virtual ✦
                </span>
              </div>

              {/* Title */}
              <div style={{ textAlign: "center", position: "relative" }}>
                <h1 style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "white",
                  margin: "0 0 8px 0",
                  letterSpacing: "-0.5px",
                  lineHeight: 1.2
                }}>
                  Bienvenido
                </h1>
                {/* Gold underline ornament */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ height: "1px", width: "40px", background: "rgba(201,168,76,0.5)" }} />
                  <div style={{ width: "5px", height: "5px", background: "#c9a84c", transform: "rotate(45deg)", borderRadius: "1px" }} />
                  <div style={{ height: "1px", width: "40px", background: "rgba(201,168,76,0.5)" }} />
                </div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0, letterSpacing: "0.02em" }}>
                  Regístrate para acceder a nuevos retos y desafíos
                </p>
              </div>
            </div>

            {/* Form section - white */}
            <div style={{ padding: "32px 40px 36px", background: "white", position: "relative" }}>
              {/* Top gold rule */}
              <div style={{
                position: "absolute",
                top: 0,
                left: "40px",
                right: "40px",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)"
              }} />

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Email field */}
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#1a2744",
                    marginBottom: "8px",
                    fontFamily: "'Georgia', serif"
                  }}>
                    Correo Electrónico
                  </label>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    border: `1.5px solid ${focused === "email" ? "#c9a84c" : "#d1d9e6"}`,
                    borderRadius: "10px",
                    padding: "12px 16px",
                    background: focused === "email" ? "rgba(201,168,76,0.03)" : "#f8f9fc",
                    transition: "all 0.2s",
                    boxShadow: focused === "email" ? "0 0 0 3px rgba(201,168,76,0.12)" : "none"
                  }}>
                    <Mail style={{ width: "16px", height: "16px", color: focused === "email" ? "#c9a84c" : "#94a3b8", flexShrink: 0 }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      placeholder="tu@correo.com"
                      required
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#1a2744",
                        fontSize: "14px",
                        fontFamily: "'Georgia', serif"
                      }}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #1a2744 0%, #0a1628 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "14px 24px",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 20px rgba(10,22,40,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
                    fontFamily: "'Georgia', serif",
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform 0.1s, box-shadow 0.2s"
                  }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(10,22,40,0.4), inset 0 1px 0 rgba(255,255,255,0.08)";
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(10,22,40,0.35), inset 0 1px 0 rgba(255,255,255,0.08)";
                  }}
                >
                  {/* Gold shimmer line */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)"
                  }} />
                  Iniciar Sesión
                  <ArrowRight style={{ width: "16px", height: "16px" }} />
                </button>
              </form>

              {/* Bottom ornament */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "24px" }}>
                <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3))" }} />
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <rect x="5" y="0" width="4" height="14" fill="rgba(201,168,76,0.3)" rx="1" />
                  <rect x="0" y="5" width="14" height="4" fill="rgba(201,168,76,0.3)" rx="1" transform="rotate(45 7 7) translate(-2 -2)" />
                </svg>
                <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(201,168,76,0.3), transparent)" }} />
              </div>
            </div>

            {/* Gold bottom bar */}
            <div style={{
              height: "4px",
              background: "linear-gradient(90deg, #8b1a1a 0%, #c9a84c 30%, #e8cc7a 50%, #c9a84c 70%, #1a2744 100%)"
            }} />
          </div>

          {/* Footer note */}
          <p style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.25)",
            fontSize: "11px",
            marginTop: "20px",
            letterSpacing: "0.04em",
            fontFamily: "Georgia, serif"
          }}>
            Una iniciativa de{" "}
            <span style={{ color: "rgba(201,168,76,0.6)" }}>Banco BISA</span>
            {" "}y{" "}
            <span style={{ color: "rgba(201,168,76,0.6)" }}>Universidad del Rosario</span>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: "relative",
        zIndex: 10,
        textAlign: "center",
        padding: "14px",
        color: "rgba(255,255,255,0.2)",
        fontSize: "11px",
        borderTop: "1px solid rgba(201,168,76,0.15)",
        letterSpacing: "0.05em",
        fontFamily: "Georgia, serif"
      }}>
        © 2025 Banco BISA · Universidad del Rosario — Todos los derechos reservados
      </footer>
    </div>
  );
}