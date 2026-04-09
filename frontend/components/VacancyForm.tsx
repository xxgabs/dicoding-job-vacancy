"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VacancyFormData } from "@/types/vacancy";

const JOB_TYPES = ["Full-Time", "Part-Time", "Kontrak", "Intern"];
const POSITIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Mobile Developer",
  "UI/UX Designer",
  "Data Scientist",
  "DevOps Engineer",
];
const LOCATIONS = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Bali", "Medan"];
const EXPERIENCE_OPTIONS = [
  "Kurang dari 1 tahun",
  "1-3 tahun",
  "4-5 tahun",
  "6-10 tahun",
  "Lebih dari 10 tahun",
];

interface VacancyFormProps {
  mode: "create" | "edit";
  initialData?: VacancyFormData;
  onSubmit: (data: VacancyFormData) => Promise<void>;
  isSubmitting: boolean;
  submitError?: string;
}

interface FormErrors {
  title?: string;
  position?: string;
  jobType?: string;
  candidates?: string;
  deadline?: string;
  location?: string;
  description?: string;
  salaryMin?: string;
  experience?: string;
}

const DEFAULT_FORM: VacancyFormData = {
  title: "",
  position: "",
  jobType: "",
  candidates: "",
  deadline: "",
  location: "",
  isRemote: false,
  description: "",
  salaryMin: "",
  salaryMax: "",
  showSalary: true,
  experience: "",
};

export default function VacancyForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting,
  submitError,
}: VacancyFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<VacancyFormData>(initialData ?? DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  function set<K extends keyof VacancyFormData>(field: K, value: VacancyFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for the field being edited
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = "Judul lowongan wajib diisi.";
    if (!form.position) errs.position = "Posisi wajib dipilih.";
    if (!form.jobType) errs.jobType = "Tipe pekerjaan wajib dipilih.";
    if (form.candidates === "" || Number(form.candidates) < 1)
      errs.candidates = "Kandidat yang dibutuhkan wajib diisi dan minimal 1.";
    if (!form.deadline) errs.deadline = "Aktif hingga wajib diisi.";
    if (!form.isRemote && !form.location) errs.location = "Lokasi wajib dipilih.";
    if (!form.description.trim()) errs.description = "Deskripsi wajib diisi.";
    if (form.salaryMin === "" || form.salaryMin === undefined)
      errs.salaryMin = "Gaji minimum wajib diisi.";
    if (!form.experience) errs.experience = "Minimum pengalaman bekerja wajib dipilih.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    await onSubmit(form);
  }

  const submitLabel = mode === "create" ? "Buat lowongan" : "Simpan perubahan";
  const submittingLabel = mode === "create" ? "Menyimpan..." : "Menyimpan...";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm space-y-6"
        noValidate
      >
        {/* Judul Lowongan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul Lowongan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan judul lowongan"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.title ? "border-red-400" : "border-gray-300"
            }`}
          />
          <p className="text-xs text-gray-400 mt-1">Contoh: Android Native Developer</p>
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Posisi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Posisi <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={form.position}
              onChange={(e) => set("position", e.target.value)}
              className={`w-full border rounded px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${
                errors.position ? "border-red-400" : "border-gray-300"
              }`}
            >
              <option value="" disabled>
                Pilih posisi yang dicari
              </option>
              {POSITIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-2.5 text-gray-400">▾</span>
          </div>
          {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position}</p>}
        </div>

        {/* Tipe Pekerjaan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipe Pekerjaan <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {JOB_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="jobType"
                  value={type}
                  checked={form.jobType === type}
                  onChange={() => set("jobType", type)}
                  className="accent-blue-600"
                />
                {type}
              </label>
            ))}
          </div>
          {errors.jobType && <p className="text-xs text-red-500 mt-1">{errors.jobType}</p>}
        </div>

        {/* Kandidat yang dibutuhkan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kandidat yang dibutuhkan <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            placeholder="Masukkan jumlah kandidat yang dibutuhkan"
            value={form.candidates}
            onChange={(e) =>
              set("candidates", e.target.value === "" ? "" : Number(e.target.value))
            }
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.candidates ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.candidates && <p className="text-xs text-red-500 mt-1">{errors.candidates}</p>}
        </div>

        {/* Aktif hingga */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aktif hingga <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => set("deadline", e.target.value)}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.deadline ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.deadline && <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>}
        </div>

        {/* Lokasi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lokasi <span className="text-red-500">*</span>
          </label>
          <div className="relative mb-2">
            <select
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className={`w-full border rounded px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${
                errors.location ? "border-red-400" : "border-gray-300"
              }`}
            >
              <option value="" disabled>
                Pilih lokasi
              </option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-2.5 text-gray-400">▾</span>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isRemote}
              onChange={(e) => set("isRemote", e.target.checked)}
              className="accent-blue-600"
            />
            Bisa remote
          </label>
          {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi <span className="text-red-500">*</span>
          </label>
          <div className={`border rounded overflow-hidden ${errors.description ? "border-red-400" : "border-gray-300"}`}>
            <div className="flex gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50 text-gray-500 text-sm">
              <button type="button" className="font-bold hover:text-gray-900">B</button>
              <button type="button" className="italic hover:text-gray-900">I</button>
              <button type="button" className="underline hover:text-gray-900">U</button>
              <button type="button" className="hover:text-gray-900">🔗</button>
              <button type="button" className="hover:text-gray-900">≡</button>
              <button type="button" className="hover:text-gray-900">&lt;/&gt;</button>
            </div>
            <textarea
              rows={8}
              placeholder="Tuliskan deskripsi pekerjaan..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full px-3 py-2 text-sm focus:outline-none resize-none"
            />
          </div>
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Rentang Gaji */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rentang gaji per bulan <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded px-2 py-2">Rp</span>
            <input
              type="number"
              placeholder="Minimum"
              value={form.salaryMin}
              onChange={(e) =>
                set("salaryMin", e.target.value === "" ? "" : Number(e.target.value))
              }
              className={`flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.salaryMin ? "border-red-400" : "border-gray-300"
              }`}
            />
            <span className="text-gray-400 text-sm">—</span>
            <span className="text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded px-2 py-2">Rp</span>
            <input
              type="number"
              placeholder="Maximum (opsional)"
              value={form.salaryMax}
              onChange={(e) =>
                set("salaryMax", e.target.value === "" ? "" : Number(e.target.value))
              }
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {errors.salaryMin && <p className="text-xs text-red-500 mt-1">{errors.salaryMin}</p>}
          <label className="flex items-center gap-2 mt-3 text-sm text-gray-600 cursor-pointer">
            <div
              role="switch"
              aria-checked={form.showSalary}
              onClick={() => set("showSalary", !form.showSalary)}
              className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                form.showSalary ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.showSalary ? "translate-x-4" : ""
                }`}
              />
            </div>
            Tampilkan gaji
          </label>
          <p className="text-xs text-gray-400 mt-1">
            Gaji akan ditampilkan di lowongan pekerjaan dan dapat dilihat oleh kandidat.
          </p>
        </div>

        {/* Minimum Pengalaman Bekerja */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum pengalaman bekerja <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {EXPERIENCE_OPTIONS.map((exp) => (
              <label key={exp} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="experience"
                  value={exp}
                  checked={form.experience === exp}
                  onChange={() => set("experience", exp)}
                  className="accent-blue-600"
                />
                {exp}
              </label>
            ))}
          </div>
          {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience}</p>}
        </div>

        {/* Submit error from API */}
        {submitError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
            {submitError}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="text-sm text-gray-600 px-6 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
