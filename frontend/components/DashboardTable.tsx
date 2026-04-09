"use client";

import { Vacancy } from "@/types/vacancy";

interface DashboardTableProps {
  vacancies: Vacancy[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetail: (id: number) => void;
}

export default function DashboardTable({
  vacancies,
  onEdit,
  onDelete,
  onViewDetail,
}: DashboardTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-3 font-semibold text-gray-700">Judul Lowongan</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Posisi</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Lokasi</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Rentang Gaji</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {vacancies.map((vacancy) => (
            <tr key={vacancy.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-900">{vacancy.title}</td>
              <td className="px-4 py-3 text-gray-700">{vacancy.company}</td>
              <td className="px-4 py-3 text-gray-700">{vacancy.location}</td>
              <td className="px-4 py-3 text-gray-700">
                {vacancy.salary_range ?? "-"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(vacancy.id)}
                    className="text-xs px-3 py-1.5 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(vacancy.id)}
                    className="text-xs px-3 py-1.5 rounded border border-red-600 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewDetail(vacancy.id)}
                    className="text-xs px-3 py-1.5 rounded border border-gray-600 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Lihat Detail
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
