"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

function Field({
  label, id, required, error, hint, children,
}: {
  label: string; id: string; required?: boolean;
  error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-wider text-[#003A70]">
        {label}
        {required && <span className="text-red-600 ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <span role="alert" className="text-[11px] text-red-600">{error}</span>}
      {hint && !error && <span className="text-[11px] text-emerald-700 font-semibold">{hint}</span>}
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────
function Input({
  id, value, onChange, onBlur, placeholder, type = "text", error, ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      aria-invalid={!!error}
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#1A1F2E] bg-white outline-none transition
        focus:ring-2 focus:ring-[#003A70]/20 focus:border-[#003A70]
        ${error ? "border-red-500 bg-red-50" : "border-[#D1D9E6] hover:border-[#b0bcc8]"}`}
      {...rest}
    />
  );
}

function Select({
  id, value, onChange, options, placeholder, error,
}: {
  id: string; value: string; onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: string[]; placeholder: string; error?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      aria-invalid={!!error}
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#1A1F2E] bg-white outline-none transition cursor-pointer
        focus:ring-2 focus:ring-[#003A70]/20 focus:border-[#003A70]
        ${error ? "border-red-500 bg-red-50" : "border-[#D1D9E6] hover:border-[#b0bcc8]"}`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function RepoCard({
  repo, selected, onToggle, disabled,
}: {
  repo: Repo; selected: boolean; onToggle: (r: Repo) => void; disabled: boolean;
}) {
  return (
    <div
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onClick={() => !disabled && onToggle(repo)}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && !disabled && onToggle(repo)}
      className={`grid grid-cols-[28px_1fr_auto] items-center gap-3 px-4 py-3 rounded-lg border-[1.5px] transition select-none
        ${selected ? "border-[#003A70] bg-[#003A70]/5" : "border-[#D1D9E6] bg-white hover:border-[#003A70]"}
        ${disabled && !selected ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition
        ${selected ? "bg-[#003A70] border-[#003A70]" : "border-[#D1D9E6]"}`}>
        {selected && (
          <svg width="11" height="9" viewBox="0 0 12 10" fill="none">
            <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <div className="overflow-hidden">
        <p className="font-semibold text-sm text-[#1A1F2E] truncate">{repo.name}</p>
        <p className="text-xs text-[#6B7280] mt-0.5 truncate">{repo.description || "Sin descripción"}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-xs text-[#6B7280]">⭐ {repo.stargazers_count}</p>
        {repo.language && <p className="text-[11px] font-semibold text-[#003A70] mt-0.5">{repo.language}</p>}
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#003A70] border-b-2 border-[#C8A84B] pb-2 mb-6">
      {children}
    </h2>
  );
}

export default function InscripcionPage() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const [emailDestinatario, setEmailDestinatario] = useState(emailFromQuery);
  const [form, setForm] = useState<FormData>(EMPTY_FORM_DATA);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [selectedRepos, setSelectedRepos] = useState<Repo[]>([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setEmailDestinatario(resolveLoginEmail(emailFromQuery));
  }, [emailFromQuery]);

  const validate = useCallback((data: FormData = form): Partial<FormData> => {
    return validateForm(data);
  }, [form]);

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
    if (!form.github.trim()) {
      setErrors((e) => ({ ...e, github: "Ingrese su usuario de GitHub primero." }));
      return;
    }
    setRepoLoading(true);
    setRepoError("");
    setRepos(null);
    setSelectedRepos([]);
    const { repos: fetchedRepos, error } = await fetchGithubPublicRepos(form.github);
    if (error) {
      setRepoError(error);
    }
    setRepos(fetchedRepos);
    setRepoLoading(false);
  };

  const toggleRepo = (repo: Repo) => {
    setSelectedRepos((prev) => toggleSelectedRepo(prev, repo));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]));
    setTouched(allTouched);
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
    <div className="min-h-screen bg-gradient-to-br from-[#002157] via-[#003A70] to-[#004A8F] px-4 py-10">

      {/* Header */}
      <header className="max-w-2xl mx-auto mb-8 text-center">

        <h2 className="text-white/70 text-xl leading-relaxed max-w-md mx-auto">
          Formulario de inscripción para desarrolladores. Completa todos los campos para enviar tu postulación.
        </h2>
        {emailDestinatario && (
          <p className="mt-3 text-sm text-amber-300/90 font-medium">
            Se enviará a: <span className="font-bold">{emailDestinatario}</span>
          </p>
        )}
      </header>

      <main className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">

        <div className="h-1 bg-gradient-to-r from-[#C8A84B] to-[#E2BE6B]" />

        <form onSubmit={handleSubmit} noValidate className="p-6 md:p-10 space-y-10">

          <section aria-labelledby="sec-personal">
            <SectionHeading>Datos Personales</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

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
                hint={form.fechaNacimiento && !errors.fechaNacimiento && age !== null ? `✓ ${age} años — cumple el requisito` : undefined}>
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
                  placeholder="+591 7XXXXXXX" autoComplete="tel" error={touched.celular ? errors.celular : undefined} />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Dirección" id="direccion" required error={touched.direccion ? errors.direccion : undefined}>
                  <Input id="direccion" value={form.direccion} onChange={handleChange("direccion")} onBlur={handleBlur("direccion")}
                    placeholder="Ej. Av. Monseñor Rivero #123, Santa Cruz" autoComplete="street-address"
                    error={touched.direccion ? errors.direccion : undefined} />
                </Field>
              </div>

            </div>
          </section>

          <section aria-labelledby="sec-github">
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
                aria-busy={repoLoading}
                className="h-[42px] px-5 rounded-lg text-sm font-semibold text-white bg-[#003A70] hover:bg-[#0066B3]
                  disabled:opacity-50 disabled:cursor-wait transition whitespace-nowrap flex-shrink-0"
              >
                {repoLoading ? "Buscando..." : "Consultar"}
              </button>
            </div>

            {repoError && (
              <div role="alert" className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                <span aria-hidden="true">⚠</span> {repoError}
              </div>
            )}

            {repos && repos.length > 0 && (
              <div className="mt-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-[#6B7280]">
                    <strong className="text-[#1A1F2E]">{repos.length}</strong> repositorios encontrados.
                    Selecciona hasta <strong className="text-[#1A1F2E]">2</strong>.
                  </p>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full transition
                    ${selectedRepos.length === 2 ? "bg-[#C8A84B]/20 text-[#C8A84B]" : "bg-[#F4F7FB] text-[#6B7280]"}`}>
                    {selectedRepos.length} / 2
                  </span>
                </div>

                <div role="group" aria-label="Selección de repositorios"
                  className="max-h-72 overflow-y-auto flex flex-col gap-2 pr-1">
                  {repos.map((repo) => (
                    <RepoCard
                      key={repo.id}
                      repo={repo}
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
          <div className="text-center pt-2">
            <button
              type="submit"
              className="px-12 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest text-white
                bg-gradient-to-r from-[#003A70] to-[#0066B3] shadow-lg shadow-[#003A70]/30
                hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#003A70]/40 transition"
            >
              Enviar Postulación
            </button>
            {submitted && (
              <p role="status" className="mt-4 text-sm font-semibold text-emerald-700">
                ✓ Se abrió tu cliente de correo con el resumen de tu postulación.
              </p>
            )}
          </div>

        </form>

        <aside aria-label="Descargo de responsabilidad" className="bg-[#F4F7FB] border-t border-[#D1D9E6] px-6 md:px-10 py-5">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-1.5">
            Descargo de responsabilidad
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Este formulario es un prototipo para evaluación en el proceso de selección de Banco BISA.
            No existe relación directa entre el Banco y la Universidad del Rosario de Colombia.
            La Hackathon es únicamente ilustrativa. Los datos no son almacenados por esta aplicación.
          </p>
        </aside>

      </main>
    </div>
  );
}
