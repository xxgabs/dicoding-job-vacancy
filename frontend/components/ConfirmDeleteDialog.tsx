"use client";

interface ConfirmDeleteDialogProps {
  open: boolean;
  vacancyTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  vacancyTitle,
  onConfirm,
  onCancel,
  isDeleting,
}: ConfirmDeleteDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <h2
          id="confirm-delete-title"
          className="text-lg font-semibold text-gray-900 mb-3"
        >
          Hapus Lowongan
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus lowongan &quot;{vacancyTitle}&quot;? Tindakan
          ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-600 px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
