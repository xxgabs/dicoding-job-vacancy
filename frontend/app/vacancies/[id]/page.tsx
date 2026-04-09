"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { useVacancy } from "@/lib/hooks";
import { parseMeta, decodeDescription } from "@/types/vacancy";

export default function VacancyDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: vacancy, isLoading, isError } = useVacancy(id);

  if (isError) {
    notFound();
  }

  const meta = vacancy ? parseMeta(vacancy.description) : {};
  const description = vacancy ? decodeDescription(vacancy.description) : "";

  const isRemote = vacancy?.location.endsWith(" (Remote)") ?? false;
  const baseLocation = isRemote
    ? vacancy!.location.slice(0, -" (Remote)".length)
    : vacancy?.location ?? "";

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/vacancies" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Kembali ke Lowongan
      </Link>
      {isLoading && <p className="text-sm text-gray-500">Memuat...</p>}
      {!isLoading && vacancy && (
        <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">{vacancy.title}</h1>

          {/* Company + job type */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              <span className="font-semibold text-gray-700">{vacancy.company}</span>
            </span>
            {meta.jobType && <span className="text-gray-500">{meta.jobType}</span>}
          </div>

          {/* Location + experience */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {baseLocation}
              {isRemote && <span className="ml-1 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Remote</span>}
            </span>
            {meta.experience && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                {meta.experience}
              </span>
            )}
          </div>

          {/* Salary */}
          {vacancy.salary_range && (
            <div className="mt-3">
              <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
                {vacancy.salary_range}
              </span>
            </div>
          )}

          <hr className="my-5 border-gray-100" />

          {/* Extra info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5 text-sm">
            {meta.candidates !== undefined && meta.candidates !== "" && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Kandidat dibutuhkan</p>
                <p className="font-medium text-gray-700">{meta.candidates} orang</p>
              </div>
            )}
            {meta.deadline && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Lamar sebelum</p>
                <p className="font-medium text-gray-700">
                  {new Date(meta.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            )}
            {meta.jobType && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Tipe pekerjaan</p>
                <p className="font-medium text-gray-700">{meta.jobType}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{description}</p>

          <div className="mt-6 text-xs text-gray-400">
            <p>Diposting: {new Date(vacancy.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </article>
      )}
    </main>
  );
}
