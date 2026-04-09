import { Vacancy, CreateVacancyPayload } from "@/types/vacancy";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getVacancies(title?: string): Promise<Vacancy[]> {
  const url = new URL(`${BASE_URL}/api/vacancies`);
  if (title) {
    url.searchParams.set("title", title);
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch vacancies: ${res.status}`);
  }
  return res.json();
}

export async function getVacancy(id: number): Promise<Vacancy> {
  const res = await fetch(`${BASE_URL}/api/vacancies/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch vacancy ${id}: ${res.status}`);
  }
  return res.json();
}

export async function createVacancy(data: CreateVacancyPayload): Promise<Vacancy> {
  const res = await fetch(`${BASE_URL}/api/vacancies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to create vacancy: ${res.status}`);
  }
  return res.json();
}

export async function updateVacancy(id: number, data: CreateVacancyPayload): Promise<Vacancy> {
  const res = await fetch(`${BASE_URL}/api/vacancies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update vacancy ${id}: ${res.status}`);
  }
  return res.json();
}

export async function deleteVacancy(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/vacancies/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete vacancy ${id}: ${res.status}`);
  }
}
