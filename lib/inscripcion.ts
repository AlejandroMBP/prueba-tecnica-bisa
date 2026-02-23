export const CI_PLACES = ["SC", "LP", "CB", "OR", "PT", "TJ", "CH", "BE", "PA", "PO"];

export type Repo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  private: boolean;
};

export type FormData = {
  nombres: string;
  apellidos: string;
  cedula: string;
  expedicion: string;
  celular: string;
  direccion: string;
  github: string;
  fechaNacimiento: string;
};

export const EMPTY_FORM_DATA: FormData = {
  nombres: "",
  apellidos: "",
  cedula: "",
  expedicion: "",
  celular: "",
  direccion: "",
  github: "",
  fechaNacimiento: "",
};

export function calcAge(dob: string): number | null {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function validateForm(data: FormData): Partial<FormData> {
  const errors: Partial<FormData> = {};

  if (!data.nombres.trim()) errors.nombres = "El nombre es requerido.";
  if (!data.apellidos.trim()) errors.apellidos = "Los apellidos son requeridos.";

  if (!data.cedula.trim()) {
    errors.cedula = "El N° de CI es requerido.";
  } else if (!/^\d{6,10}$/.test(data.cedula.trim())) {
    errors.cedula = "CI válido: 6-10 dígitos.";
  }

  if (!data.expedicion) errors.expedicion = "Seleccione el lugar de expedición.";

  if (!data.celular.trim()) {
    errors.celular = "El celular es requerido.";
  } else if (!/^\+?\d{7,15}$/.test(data.celular.replace(/\s/g, ""))) {
    errors.celular = "Número de celular inválido.";
  }

  if (!data.direccion.trim()) errors.direccion = "La dirección es requerida.";
  if (!data.github.trim()) errors.github = "El usuario de GitHub es requerido.";

  if (!data.fechaNacimiento) {
    errors.fechaNacimiento = "La fecha de nacimiento es requerida.";
  } else {
    const age = calcAge(data.fechaNacimiento);
    if (age === null || age >= 30) {
      errors.fechaNacimiento = "Solo desarrolladores menores de 30 años.";
    } else if (age < 15) {
      errors.fechaNacimiento = "Fecha de nacimiento inválida.";
    }
  }

  return errors;
}

export function buildMailto(to: string, formData: FormData, repos: Repo[]): string {
  const subject = encodeURIComponent("Postulación Hackathon Virtual Banco BISA");
  const repoLines = repos.map((repo) => `• ${repo.name}: ${repo.html_url}`).join("\n");
  const body = encodeURIComponent(
    `POSTULACIÓN HACKATHON VIRTUAL BANCO BISA\n${"─".repeat(42)}\n\n` +
      `Nombres:          ${formData.nombres}\n` +
      `Apellidos:        ${formData.apellidos}\n` +
      `N° CI:            ${formData.cedula} (${formData.expedicion})\n` +
      `Celular:          ${formData.celular}\n` +
      `Dirección:        ${formData.direccion}\n` +
      `GitHub:           ${formData.github}\n` +
      `Fecha nacimiento: ${formData.fechaNacimiento}\n\n` +
      `REPOSITORIOS SELECCIONADOS:\n${repoLines}`,
  );

  return `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${subject}&body=${body}`;
}

export async function fetchGithubPublicRepos(username: string): Promise<{ repos: Repo[] | null; error: string }> {
  try {
    const response = await fetch(`https://api.github.com/users/${username.trim()}/repos?per_page=100&sort=updated`);

    if (!response.ok) {
      return {
        repos: null,
        error: response.status === 404 ? "Usuario de GitHub no encontrado." : "Error al consultar. Intente nuevamente.",
      };
    }

    const data: Repo[] = await response.json();
    const publicRepos = data.filter((repo) => !repo.private);

    if (publicRepos.length === 0) {
      return { repos: [], error: "Sin repositorios públicos. Debe tener al menos 1." };
    }

    return { repos: publicRepos, error: "" };
  } catch {
    return { repos: null, error: "Error de red. Verifique su conexión." };
  }
}

export function toggleSelectedRepo(current: Repo[], repo: Repo, limit = 2): Repo[] {
  const alreadySelected = current.some((item) => item.id === repo.id);

  if (alreadySelected) {
    return current.filter((item) => item.id !== repo.id);
  }

  if (current.length >= limit) {
    return current;
  }

  return [...current, repo];
}
