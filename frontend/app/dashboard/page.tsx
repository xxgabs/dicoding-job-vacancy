"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useVacancies } from "@/lib/hooks";
import { useDeleteVacancy } from "@/lib/hooks";
import DashboardTable from "@/components/DashboardTable";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { Vacancy } from "@/types/vacancy";

export default function DashboardPage() {
  const router = useRouter();
  const { data: vacancies, isLoading, isError, refetch } = useVacancies();
  const deleteMutation = useDeleteVacancy();

  const [deleteTarget, setDeleteTarget] = useState<Vacancy | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleEdit(id: number) {
    router.push(`/vacancies/${id}/edit`);
  }

  function handleDelete(id: number) {
    const vacancy = vacancies?.find((v) => v.id === id) ?? null;
    setDeleteTarget(vacancy);
    setDeleteError(null);
  }

  function handleViewDetail(id: number) {
    router.push(`/vacancies/${id}`);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      setDeleteError("Gagal menghapus lowongan. Silakan coba lagi.");
      setDeleteTarget(null);
    }
  }

  function handleCancelDelete() {
    setDeleteTarget(null);
    setDeleteError(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Lowongan</h1>
          <Link
            href="/vacancies/create"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Buat Lowongan
          </Link>
        </div>

        {deleteError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {deleteError}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <span>Memuat data...</span>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-gray-600">Gagal memuat data lowongan.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!isLoading && !isError && vacancies && vacancies.length === 0 && (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <p>Belum ada lowongan. Buat lowongan pertama Anda.</p>
          </div>
        )}

        {!isLoading && !isError && vacancies && vacancies.length > 0 && (
          <DashboardTable
            vacancies={vacancies}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetail={handleViewDetail}
          />
        )}

        <ConfirmDeleteDialog
          open={deleteTarget !== null}
          vacancyTitle={deleteTarget?.title ?? ""}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
