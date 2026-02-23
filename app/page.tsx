"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Circle, Mail } from "lucide-react";
import { buildInscripcionUrl, saveLoginEmail } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [focused, setFocused] = useState(false);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setEmailError("Ingrese un correo electrónico válido.");
      return;
    }

    setEmailError("");
    saveLoginEmail(normalizedEmail);
    router.push(buildInscripcionUrl(normalizedEmail));
  };

  return (
    <div className="min-h-screen flex font-sans bg-surface-base">

      <div className="w-[50%] bg-brand-navy relative flex flex-col justify-between p-10 overflow-hidden max-lg:hidden">

        <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-brand-gold via-brand-gold-soft to-brand-gold" />

        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-(--effect-glow-red)" />

        {/* Circulos decorativos */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-120 h-120 rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 rounded-full border border-white/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-162 h-162 rounded-full border border-white/3" />

        {/* Logos */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="bg-surface-card rounded-lg px-3 py-2 w-28 h-11 flex items-center justify-center">
            <Image src="/images/BISA.jpeg" alt="Banco BISA" width={100} height={36} className="object-contain w-full h-full" />
          </div>
          <div className="w-px h-7 bg-surface-card/15" />
          <div className="bg-surface-card rounded-lg px-3 py-2 w-28 h-11 flex items-center justify-center">
            <Image src="/images/UDR.webp" alt="Universidad del Rosario" width={100} height={36} className="object-contain w-full h-full" />
          </div>
        </div>

        <div className="relative z-10">
          <span className="inline-block text-[11px] font-medium tracking-[0.14em] uppercase text-brand-gold mb-5">
            Hackathon Virtual
          </span>
          <h2 className="font-serif text-[40px] leading-[1.18] text-white mb-4">
            Resuelve retos{" "}
            <em className="italic text-brand-gold-soft">reales</em>{" "}
            del sector financiero
          </h2>
          <p className="text-sm leading-[1.75] text-white/80 max-w-72">
            Una iniciativa de Banco BISA y la Universidad del Rosario para impulsar soluciones con impacto real.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <Circle size={8} className="text-brand-gold opacity-70" fill="currentColor" aria-hidden="true" />
          <span className="text-[11px] text-white/80 tracking-[0.04em]">
            © 2026 Banco BISA · Universidad del Rosario
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-12 py-12 bg-surface-base relative">

        <div className="absolute inset-5 border border-brand-navy/7 rounded-2xl pointer-events-none" />

        <div className="w-full max-w-95 relative z-10">

          <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-brand-gold mb-2.5">
            Acceso al evento
          </p>
          <p className="text-[13px] text-text-muted leading-[1.5] mb-1.5">
            Bienvenido
          </p>
          <h1 className="font-serif text-xl text-text-primary leading-[1.2] mb-8">
            REGISTRO AL HACKATHON VIRTUAL
          </h1>

          <form onSubmit={handleSubmit}>
            <label className="block text-[11px] font-semibold tracking-widest uppercase text-text-primary mb-2">
              Correo electrónico
            </label>

            <div className={`flex items-center gap-2.5 bg-surface-card rounded-[10px] px-4 py-3.5 mb-3.5 border-[1.5px] transition-all duration-200
              ${focused
                ? "border-brand-navy shadow-(--effect-focus-ring)"
                : "border-surface-muted"
              }`}
            >
              <Mail
                size={15}
                className={`shrink-0 transition-colors duration-200 ${focused ? "text-text-primary" : "text-text-neutral"}`}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="tu@correo.com"
                inputMode="email"
                autoComplete="email"
                required
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
                className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder-text-placeholder font-sans"
              />
            </div>
            {emailError && (
              <p id="email-error" role="alert" className="mb-3.5 text-[11px] text-state-error">
                {emailError}
              </p>
            )}

            <button
              type="submit"
              className="relative w-full overflow-hidden bg-brand-navy hover:bg-brand-navy-hover text-white rounded-[10px] px-6 py-3.5 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-px"
            >
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-brand-gold via-brand-gold-soft to-brand-gold" />
              <span className="relative z-10 flex items-center gap-2">
                Iniciar sesión
                <ArrowRight size={15} />
              </span>
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-text-subtle leading-[1.7]">
            Al continuar aceptas los términos del hackathon virtual 2025
          </p>
        </div>
      </div>
    </div>
  );
}
