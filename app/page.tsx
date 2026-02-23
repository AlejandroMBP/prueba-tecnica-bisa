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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-800 rounded-full opacity-5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-8">
          <div className="w-36 h-14 bg-white rounded-xl px-3 py-2 border border-white/20 flex items-center justify-center">
            <Image
              src="/images/BISA.jpeg"
              alt="Banco BISA"
              width={120}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="w-36 h-14 bg-white rounded-xl px-3 py-2 border border-white/20 flex items-center justify-center">
            <Image
              src="/images/UDR.webp"
              alt="Universidad del Rosario"
              width={120}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="bg-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-500/30">
                Hackathon Virtual
              </span>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white leading-tight mb-2">
                Bienvenido
              </h1>
              <p className="text-white/50 text-sm">Registrate para acceder a nuevos retos y desafíos</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-white/70 text-xs font-medium uppercase tracking-wider block">
                  Correo electrónico
                </label>
                <div
                  className={`flex items-center gap-3 bg-white/5 border rounded-xl px-4 py-3 transition-all duration-200 ${focused === "email"
                    ? "border-blue-400/60 bg-blue-500/5 shadow-lg shadow-blue-500/10"
                    : "border-white/10 hover:border-white/20"
                    }`}
                >
                  <Mail className="w-4 h-4 text-white/30 flex-shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="tu@correo.com"
                    required
                    className="flex-1 bg-transparent text-white placeholder-white/20 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Iniciar sesión
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>

            </form>
          </div>

          {/* Footer note */}
          <p className="text-center text-white/20 text-xs mt-6">
            Una iniciativa de{" "}
            <span className="text-white/40">Banco BISA</span>
            {" "}y{" "}
            <span className="text-white/40">Universidad del Rosario</span>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-white/20 text-xs border-t border-white/5">
        © 2025 Banco BISA · Universidad del Rosario — Todos los derechos reservados
      </footer>
    </div>
  );
}
