import Link from "next/link";
import { Vacancy } from "@/types/vacancy";
import { parseMeta } from "@/types/vacancy";

interface JobCardProps {
  vacancy: Vacancy;
}

export default function JobCard({ vacancy }: JobCardProps) {
  const meta = parseMeta(vacancy.description);

  // Strip " (Remote)" for display, show separately
  const isRemote = vacancy.location.endsWith(" (Remote)");
  const baseLocation = isRemote
    ? vacancy.location.slice(0, -" (Remote)".length)
    : vacancy.location;

  return (
    <Link
      href={`/vacancies/${vacancy.id}`}
      data-testid="job-card"
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900">{vacancy.title}</h2>

          {/* Row 1: company + job type */}
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              {/* building icon */}
              <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              <span className="font-medium text-gray-700">{vacancy.company}</span>
            </span>
            {meta.jobType && (
              <span className="text-gray-500">{meta.jobType}</span>
            )}
          </div>

          {/* Row 2: location + experience */}
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
            {(baseLocation || isRemote) && (
              <span className="flex items-center gap-1">
                {/* location pin icon */}
                <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {baseLocation}
                {isRemote && <span className="ml-1 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Remote</span>}
              </span>
            )}
            {meta.experience && (
              <span className="flex items-center gap-1">
                {/* briefcase icon */}
                <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                {meta.experience}
              </span>
            )}
          </div>
        </div>

        {/* Right side: dates */}
        <div className="text-right text-xs text-gray-400 shrink-0">
          <p>Dibuat pada {new Date(vacancy.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
          {meta.deadline && (
            <p className="mt-1">Lamar sebelum {new Date(meta.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
          )}
        </div>
      </div>

      {/* Salary badge */}
      {vacancy.salary_range && (
        <div className="mt-3">
          <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
            {vacancy.salary_range}
          </span>
        </div>
      )}
    </Link>
  );
}
