"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import VacancyForm from "@/components/VacancyForm";
import { useVacancy, useUpdateVacancy } from "@/lib/hooks";
import { formDataToPayload, VacancyFormData, Vacancy, decodeDescription, parseMeta } from "@/types/vacancy";

export function vacancyToFormData(vacancy: Vacancy): VacancyFormData {
  // Parse location: strip " (Remote)" suffix if present
  let location = vacancy.location;
  let isRemote = false;
  if (location.endsWith(" (Remote)")) {
    location = location.slice(0, -" (Remote)".length);
    isRemote = true;
  }

  // Parse salary_range: "Rp {min} - Rp {max}" or "Rp {min}"
  let salaryMin: number | "" = "";
  let salaryMax: number | "" = "";
  let showSalary = false;
  if (vacancy.salary_range !== null && vacancy.salary_range !== undefined) {
    showSalary = true;
    const match = vacancy.salary_range.match(/Rp (\d+)(?:\s*-\s*Rp (\d+))?/);
    if (match) {
      salaryMin = Number(match[1]);
      salaryMax = match[2] ? Number(match[2]) : "";
    }
  }

  // Parse extra metadata encoded in description
  const meta = parseMeta(vacancy.description);

  return {
    title: vacancy.title,
    position: vacancy.company,
    description: decodeDescription(vacancy.description),
    location,
    isRemote,
    salaryMin,
    salaryMax,
    showSalary,
    jobType: meta.jobType ?? "Full-Time",
    candidates: meta.candidates ?? 1,
    deadline: meta.deadline ?? "",
    experience: meta.experience ?? "",
  };
}

interface EditVacancyPageProps {
  params: { id: string };
}

export default function EditVacancyPage({ params }: EditVacancyPageProps) {
  const router = useRouter();
  const id = Number(params.id);
  const { data: vacancy, isLoading, error } = useVacancy(id);
  const mutation = useUpdateVacancy();

  useEffect(() => {
    if (error && error.message.includes("404")) {
      router.push("/dashboard");
    }
  }, [error, router]);

  async function handleSubmit(data: VacancyFormData) {
    const payload = formDataToPayload(data);
    await mutation.mutateAsync({ id, data: payload });
    router.push("/dashboard");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500">Memuat data lowongan...</p>
      </div>
    );
  }

  if (!vacancy) return null;

  const initialData = vacancyToFormData(vacancy);

  return (
    <>
      <Hero
        title="Edit lowongan pekerjaan"
        subtitle="Perbarui informasi lowongan pekerjaan Anda agar kandidat mendapatkan informasi yang akurat."
      />
      <VacancyForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        submitError={mutation.error?.message}
      />
    </>
  );
}
