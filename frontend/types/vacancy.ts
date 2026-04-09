export interface Vacancy {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  salary_range: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateVacancyPayload {
  title: string;
  description: string;
  company: string;
  location: string;
  salary_range?: string | null;
}

export interface VacancyFormData {
  title: string;
  position: string;
  jobType: string;
  candidates: number | "";
  deadline: string;
  location: string;
  isRemote: boolean;
  description: string;
  salaryMin: number | "";
  salaryMax: number | "";
  showSalary: boolean;
  experience: string;
}

// Metadata block appended to description to persist extra fields not in backend schema
export interface VacancyMeta {
  jobType?: string;
  candidates?: number | "";
  deadline?: string;
  experience?: string;
}

const META_PREFIX = "\n\n<!--meta:";
const META_SUFFIX = ":meta-->";

/** Encode extra form fields into description as a hidden metadata block */
export function encodeDescription(data: VacancyFormData): string {
  const meta: VacancyMeta = {
    jobType: data.jobType || undefined,
    candidates: data.candidates !== "" ? data.candidates : undefined,
    deadline: data.deadline || undefined,
    experience: data.experience || undefined,
  };
  const hasAny = Object.values(meta).some((v) => v !== undefined);
  if (!hasAny) return data.description;
  return `${data.description}${META_PREFIX}${JSON.stringify(meta)}${META_SUFFIX}`;
}

/** Extract the user-visible description (strips metadata block) */
export function decodeDescription(raw: string): string {
  const idx = raw.indexOf(META_PREFIX);
  return idx === -1 ? raw : raw.slice(0, idx);
}

/** Parse metadata from description field */
export function parseMeta(raw: string): VacancyMeta {
  const start = raw.indexOf(META_PREFIX);
  if (start === -1) return {};
  const end = raw.indexOf(META_SUFFIX, start);
  if (end === -1) return {};
  try {
    return JSON.parse(raw.slice(start + META_PREFIX.length, end));
  } catch {
    return {};
  }
}

export function formDataToPayload(data: VacancyFormData): CreateVacancyPayload {
  const location = data.isRemote
    ? data.location
      ? `${data.location} (Remote)`
      : "Remote"
    : data.location;

  let salary_range: string | null = null;
  if (data.showSalary && data.salaryMin !== "") {
    salary_range =
      data.salaryMax !== ""
        ? `Rp ${data.salaryMin} - Rp ${data.salaryMax}`
        : `Rp ${data.salaryMin}`;
  }

  return {
    title: data.title,
    company: data.position,
    description: encodeDescription(data),
    location,
    salary_range,
  };
}
