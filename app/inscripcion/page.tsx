"use client";

import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AlertTriangle, Check, CircleCheck } from "lucide-react";
import { resolveLoginEmail } from "@/lib/auth";
import {
  buildMailto,
  calcAge,
  CI_PLACES,
  EMPTY_FORM_DATA,
  fetchGithubPublicRepos,
  type FormData,
  type Repo,
  toggleSelectedRepo,
  validateForm,
} from "@/lib/inscripcion";
import {
  Field,
  Input,
  RepoCard,
  SectionHeading,
  Select,
} from "@/components/inscripcion/form-components";
import Link from "next/link";

export default function InscripcionPage() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const emailDestinatario = useMemo(() => resolveLoginEmail(emailFromQuery), [emailFromQuery]);
  const [form, setForm] = useState<FormData>(EMPTY_FORM_DATA);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [selectedRepos, setSelectedRepos] = useState<Repo[]>([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validate = useCallback((data: FormData = form) => validateForm(data), [form]);

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    if (touched[field]) setErrors((err) => ({ ...err, [field]: validate({ ...form, [field]: val })[field] }));
  };

  const handleBlur = (field: keyof FormData) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((err) => ({ ...err, [field]: validate()[field] }));
  };

  const fetchRepos = async () => {
    if (!form.github.trim()) { setErrors((e) => ({ ...e, github: "Ingrese su usuario de GitHub primero." })); return; }
    setRepoLoading(true); setRepoError(""); setRepos(null); setSelectedRepos([]);
    const { repos: fetchedRepos, error } = await fetchGithubPublicRepos(form.github);
    if (error) setRepoError(error);
    setRepos(fetchedRepos);
    setRepoLoading(false);
  };

  const toggleRepo = (repo: Repo) => setSelectedRepos((prev) => toggleSelectedRepo(prev, repo));

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(form).map((k) => [k, true])));
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!emailDestinatario) { setRepoError("No se encontró el correo del login. Vuelva a iniciar sesión."); return; }
    if (!repos || repos.length === 0) { setRepoError("Consulte sus repositorios de GitHub antes de enviar."); return; }
    if (selectedRepos.length === 0) { setRepoError("Seleccione al menos 1 repositorio."); return; }
    window.location.href = buildMailto(emailDestinatario, form, selectedRepos);
    setSubmitted(true);
  };

  const age = calcAge(form.fechaNacimiento);

  return (
    <div className="min-h-screen bg-surface-base font-sans">

      <div className="bg-brand-navy">
        <div className="h-0.75 bg-linear-to-r from-brand-gold via-brand-gold-soft to-brand-gold" />
        <div className="max-w-2xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-surface-card rounded-lg px-3 py-1.5 w-24 h-9 flex items-center justify-center">
              <Image src="/images/BISA.jpeg" alt="Banco BISA" width={80} height={32} className="object-contain w-full h-full" />
            </div>
            <div className="w-px h-6 bg-surface-card/15" />
            <div className="bg-surface-card rounded-lg px-3 py-1.5 w-24 h-9 flex items-center justify-center">
              <Image src="/images/UDR.webp" alt="Universidad del Rosario" width={80} height={32} className="object-contain w-full h-full" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] tracking-[0.14em] uppercase text-brand-gold leading-none">Hackathon Virtual</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 pt-10 pb-0">
        <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-brand-gold">
          Inscripción
        </span>
        <h1 className="font-serif text-[32px] text-text-primary leading-[1.2] mt-2 mb-2">
          Formulario de postulación
        </h1>
        <p className="text-sm text-text-muted leading-[1.7]">
          Completa todos los campos para enviar tu candidatura al hackathon.
        </p>
        {emailDestinatario && (
          <div className="inline-flex items-center gap-2 mt-3 px-3.5 py-2 rounded-lg bg-brand-gold/10 border border-brand-gold/25">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            <span className="text-xs text-text-primary">
              Se enviará a: <strong>{emailDestinatario}</strong>
            </span>
          </div>
        )}
      </div>

      <main className="max-w-2xl mx-auto px-8 py-6 pb-12">
        <div className="bg-surface-card rounded-2xl border border-surface-muted shadow-(--effect-card-shadow) overflow-hidden">

          <form onSubmit={handleSubmit} noValidate className="p-10 space-y-10">

            <section>
              <SectionHeading>Datos Personales</SectionHeading>
              <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">

                <Field label="Nombres" id="nombres" required error={touched.nombres ? errors.nombres : undefined}>
                  <Input id="nombres" value={form.nombres} onChange={handleChange("nombres")} onBlur={handleBlur("nombres")}
                    placeholder="Ej. María Elena" error={touched.nombres ? errors.nombres : undefined} autoComplete="given-name" />
                </Field>

                <Field label="Apellidos" id="apellidos" required error={touched.apellidos ? errors.apellidos : undefined}>
                  <Input id="apellidos" value={form.apellidos} onChange={handleChange("apellidos")} onBlur={handleBlur("apellidos")}
                    placeholder="Ej. González Pérez" error={touched.apellidos ? errors.apellidos : undefined} autoComplete="family-name" />
                </Field>

                <Field label="Fecha de Nacimiento" id="fechaNacimiento" required
                  error={touched.fechaNacimiento ? errors.fechaNacimiento : undefined}
                  hint={form.fechaNacimiento && !errors.fechaNacimiento && age !== null
                    ? <span className="inline-flex items-center gap-1"><Check size={12} aria-hidden="true" />{age} años - cumple el requisito</span>
                    : undefined}>
                  <Input id="fechaNacimiento" type="date" value={form.fechaNacimiento}
                    onChange={handleChange("fechaNacimiento")} onBlur={handleBlur("fechaNacimiento")}
                    max={new Date().toISOString().split("T")[0]}
                    error={touched.fechaNacimiento ? errors.fechaNacimiento : undefined} />
                </Field>

                <Field label="N° Cédula de Identidad" id="cedula" required error={touched.cedula ? errors.cedula : undefined}>
                  <Input id="cedula" value={form.cedula} onChange={handleChange("cedula")} onBlur={handleBlur("cedula")}
                    placeholder="Ej. 1234567" inputMode="numeric" error={touched.cedula ? errors.cedula : undefined} />
                </Field>

                <Field label="Expedición del C.I." id="expedicion" required error={touched.expedicion ? errors.expedicion : undefined}>
                  <Select id="expedicion" value={form.expedicion} onChange={handleChange("expedicion")}
                    options={CI_PLACES} placeholder="Seleccionar..." error={touched.expedicion ? errors.expedicion : undefined} />
                </Field>

                <Field label="N° Celular" id="celular" required error={touched.celular ? errors.celular : undefined}>
                  <Input id="celular" type="tel" value={form.celular} onChange={handleChange("celular")} onBlur={handleBlur("celular")}
                    placeholder="7XXXXXXX" autoComplete="tel" error={touched.celular ? errors.celular : undefined} />
                </Field>

                <div className="col-span-2 max-sm:col-span-1">
                  <Field label="Dirección" id="direccion" required error={touched.direccion ? errors.direccion : undefined}>
                    <Input id="direccion" value={form.direccion} onChange={handleChange("direccion")} onBlur={handleBlur("direccion")}
                      placeholder="Ej. Av. Monseñor Rivero Nro. 123, Santa Cruz" autoComplete="street-address"
                      error={touched.direccion ? errors.direccion : undefined} />
                  </Field>
                </div>

              </div>
            </section>

            {/* ── GitHub ── */}
            <section>
              <SectionHeading>Repositorios GitHub</SectionHeading>

              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Field label="Usuario de GitHub" id="github" required error={touched.github ? errors.github : undefined}>
                    <Input id="github" value={form.github} onChange={handleChange("github")} onBlur={handleBlur("github")}
                      placeholder="Ej. octocat" autoCapitalize="none" spellCheck={false}
                      error={touched.github ? errors.github : undefined} />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={fetchRepos}
                  disabled={repoLoading}
                  className="relative h-11 px-5 rounded-[10px] text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navy-hover disabled:opacity-50 disabled:cursor-wait transition-all duration-200 whitespace-nowrap shrink-0 overflow-hidden"
                >
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-brand-gold via-brand-gold-soft to-brand-gold" />
                  <span className="relative z-10">{repoLoading ? "Buscando..." : "Consultar"}</span>
                </button>
              </div>

              {repoError && (
                <div role="alert" className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-state-error-bg border border-state-error-border text-state-error text-sm">
                  <AlertTriangle size={16} aria-hidden="true" />
                  {repoError}
                </div>
              )}

              {repos && repos.length > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-text-muted">
                      <strong className="text-text-primary">{repos.length}</strong> repositorios.
                      Selecciona hasta <strong className="text-text-primary">2</strong>.
                    </p>
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all duration-200
                      ${selectedRepos.length === 2
                        ? "bg-brand-gold/10 text-brand-gold border-brand-gold/30"
                        : "bg-surface-base text-text-muted border-surface-muted"
                      }`}>
                      {selectedRepos.length} / 2
                    </span>
                  </div>

                  <div role="group" aria-label="Selección de repositorios"
                    className="max-h-72 overflow-y-auto flex flex-col gap-2 pr-1">
                    {repos.map((repo) => (
                      <RepoCard
                        key={repo.id} repo={repo}
                        selected={!!selectedRepos.find((r) => r.id === repo.id)}
                        onToggle={toggleRepo}
                        disabled={selectedRepos.length >= 2 && !selectedRepos.find((r) => r.id === repo.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ── Submit ── */}
            <div className="pt-1">
              <div className="flex items-center justify-center gap-3 max-sm:flex-col">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center min-w-40 px-6 py-3.5 rounded-[10px] text-sm font-semibold uppercase tracking-[0.08em] border border-surface-muted text-text-primary bg-surface-card hover:border-brand-navy/40 transition-all duration-200"
                >
                  Cancelar
                </Link>
              <button
                type="submit"
                className="relative overflow-hidden min-w-40 px-12 py-3.5 rounded-[10px] text-sm font-semibold uppercase tracking-[0.08em] text-white bg-brand-navy hover:bg-brand-navy-hover hover:-translate-y-px transition-all duration-200 shadow-(--effect-button-shadow) hover:shadow-(--effect-button-shadow-hover)"
              >
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-brand-gold via-brand-gold-soft to-brand-gold" />
                <span className="relative z-10">Enviar Postulación</span>
              </button>
              </div>

              {submitted && (
                <p role="status" className="mt-4 text-sm font-semibold text-state-success inline-flex items-center justify-center gap-1.5 w-full">
                  <CircleCheck size={16} aria-hidden="true" />
                  Se abrió tu cliente de correo con el resumen de tu postulación.
                </p>
              )}
            </div>

          </form>

          {/* Disclaimer */}
          <aside className="bg-surface-base border-t border-surface-muted px-10 py-5">
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-muted mb-1.5">
              Descargo de responsabilidad
            </p>
            <p className="text-xs text-text-muted leading-relaxed">
              Este formulario es un prototipo para evaluación en el proceso de selección de Banco BISA.
              No existe relación directa entre el Banco y la Universidad del Rosario de Colombia.
              La Hackathon es únicamente ilustrativa. Los datos no son almacenados por esta aplicación.
            </p>
          </aside>

        </div>
      </main>
    </div>
  );
}
