const LOGIN_EMAIL_KEY = "loginEmail";

export function saveLoginEmail(email: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOGIN_EMAIL_KEY, email);
}

export function getLoginEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(LOGIN_EMAIL_KEY) ?? "";
}

export function resolveLoginEmail(emailFromQuery: string): string {
  if (emailFromQuery) {
    saveLoginEmail(emailFromQuery);
    return emailFromQuery;
  }

  return getLoginEmail();
}

export function buildInscripcionUrl(email: string): string {
  return `/inscripcion?email=${encodeURIComponent(email)}`;
}
