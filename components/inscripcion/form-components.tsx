"use client";

import { useState, isValidElement, cloneElement } from "react";
import { Check, Star } from "lucide-react";
import { type Repo } from "@/lib/inscripcion";

type FieldProps = {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
};

export function Field({ label, id, required, error, hint, children }: FieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [
    error ? errorId : undefined,
    hint && !error ? hintId : undefined,
  ].filter(Boolean).join(" ") || undefined;

  const childWithA11y = isValidElement(children)
    ? cloneElement(children as React.ReactElement<{ "aria-describedby"?: string; "aria-errormessage"?: string }>, {
      "aria-describedby": describedBy,
      "aria-errormessage": error ? errorId : undefined,
    })
    : children;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold tracking-widest uppercase text-text-primary">
        {label}
        {required && <span className="text-state-error ml-0.5" aria-hidden="true">*</span>}
      </label>
      {childWithA11y}
      {error && <span id={errorId} role="alert" className="text-[11px] text-state-error">{error}</span>}
      {hint && !error && <span id={hintId} className="text-[11px] text-state-success font-semibold">{hint}</span>}
    </div>
  );
}

export function Input({
  id, value, onChange, onBlur, placeholder, type = "text", error, ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      placeholder={placeholder}
      aria-invalid={!!error}
      className={`w-full px-3.5 py-2.75 rounded-[10px] border-[1.5px] text-sm text-text-primary bg-surface-card outline-none font-sans transition-all duration-200
        ${error
          ? "border-state-error bg-state-error-bg"
          : focused
            ? "border-brand-navy shadow-(--effect-focus-ring)"
            : "border-surface-muted hover:border-text-placeholder"
        }`}
      {...rest}
    />
  );
}

type SelectProps = {
  id: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: string[];
  placeholder: string;
  error?: string;
};

export function Select({ id, value, onChange, options, placeholder, error }: SelectProps) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-invalid={!!error}
      className={`w-full px-3.5 py-2.75 rounded-[10px] border-[1.5px] text-sm text-text-primary bg-surface-card outline-none cursor-pointer font-sans transition-all duration-200
        ${error
          ? "border-state-error bg-state-error-bg"
          : focused
            ? "border-brand-navy shadow-(--effect-focus-ring)"
            : "border-surface-muted hover:border-text-placeholder"
        }`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

type RepoCardProps = {
  repo: Repo;
  selected: boolean;
  onToggle: (r: Repo) => void;
  disabled: boolean;
};

export function RepoCard({ repo, selected, onToggle, disabled }: RepoCardProps) {
  return (
    <div
      role="checkbox"
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onToggle(repo)}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !disabled) {
          e.preventDefault();
          onToggle(repo);
        }
      }}
      className={`grid grid-cols-[24px_1fr_auto] items-center gap-3 px-4 py-3 rounded-[10px] border-[1.5px] transition-all duration-150 select-none
        ${selected
          ? "border-brand-navy bg-brand-navy/4"
          : "border-surface-muted bg-surface-card hover:border-brand-navy/40"
        }
        ${disabled && !selected ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-all duration-150
        ${selected ? "bg-brand-navy border-brand-navy" : "border-surface-muted"}`}>
        {selected && <Check size={12} className="text-white" aria-hidden="true" />}
      </div>

      <div className="overflow-hidden">
        <p className="font-semibold text-sm text-text-primary truncate">{repo.name}</p>
        <p className="text-xs text-text-muted mt-0.5 truncate">{repo.description || "Sin descripción"}</p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-xs text-text-muted inline-flex items-center gap-1">
          <Star size={12} aria-hidden="true" />
          {repo.stargazers_count}
        </p>
        {repo.language && <p className="text-[11px] font-semibold text-text-primary mt-0.5">{repo.language}</p>}
      </div>
    </div>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-[11px] font-bold tracking-[0.18em] uppercase text-text-primary mb-2">
        {children}
      </h2>
      <div className="h-px bg-linear-to-r from-brand-gold via-brand-gold-soft to-transparent" />
    </div>
  );
}
