"use client";

import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import VacancyForm from "@/components/VacancyForm";
import { useCreateVacancy } from "@/lib/hooks";
import { formDataToPayload, VacancyFormData } from "@/types/vacancy";

export default function CreateVacancyPage() {
  const router = useRouter();
  const mutation = useCreateVacancy();

  async function handleSubmit(data: VacancyFormData) {
    const payload = formDataToPayload(data);
    await mutation.mutateAsync(payload);
    router.push("/dashboard");
  }

  return (
    <>
      <Hero
        title="Buat lowongan pekerjaan"
        subtitle="Dicoding Jobs menghubungkan industri dengan talenta yang tepat. Mencari tim baru tidak harus melelahkan dan boros biaya."
      />
      <VacancyForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        submitError={mutation.error?.message}
      />
    </>
  );
}
