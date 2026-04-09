"use client";

import { useState } from "react";
import { useVacancies } from "@/lib/hooks";
import JobCard from "@/components/JobCard";
import SearchInput from "@/components/SearchInput";

export default function VacanciesPage() {
  const [title, setTitle] = useState("");
  const { data: vacancies, isLoading, isError } = useVacancies(title || undefined);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Job Vacancies</h1>
      <div className="mb-6">
        <SearchInput
          value={title}
          onChange={setTitle}
          placeholder="Search by title..."
        />
      </div>
      {isLoading && (
        <p className="text-sm text-gray-500">Loading...</p>
      )}
      {isError && (
        <p className="text-sm text-red-500">Failed to load vacancies. Please try again.</p>
      )}
      {!isLoading && !isError && vacancies && vacancies.length === 0 && (
        <p className="text-sm text-gray-500">No vacancies found.</p>
      )}
      {!isLoading && !isError && vacancies && vacancies.length > 0 && (
        <div className="flex flex-col gap-4">
          {vacancies.map((vacancy) => (
            <JobCard key={vacancy.id} vacancy={vacancy} />
          ))}
        </div>
      )}
    </main>
  );
}
