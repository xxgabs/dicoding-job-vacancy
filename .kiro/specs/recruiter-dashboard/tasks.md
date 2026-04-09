# Implementation Plan: Recruiter Dashboard

## Overview

Implementasi fitur Recruiter Dashboard secara bertahap: mulai dari layer API dan hooks, lalu komponen UI, halaman-halaman utama, hingga property-based tests. Setiap langkah membangun di atas langkah sebelumnya dan langsung terintegrasi.

## Tasks

- [x] 1. Extend `lib/api.ts` dan `lib/hooks.ts` dengan mutation support
  - [x] 1.1 Tambahkan `updateVacancy` dan `deleteVacancy` ke `lib/api.ts`
    - Tambahkan fungsi `updateVacancy(id: number, data: CreateVacancyPayload): Promise<Vacancy>` yang memanggil `PUT /api/vacancies/{id}`
    - Tambahkan fungsi `deleteVacancy(id: number): Promise<void>` yang memanggil `DELETE /api/vacancies/{id}`
    - _Requirements: 11.3, 12.2_

  - [x] 1.2 Tambahkan mutation hooks ke `lib/hooks.ts`
    - Tambahkan `useCreateVacancy()` menggunakan `useMutation` yang memanggil `createVacancy` dan invalidate cache `["vacancies"]` on success
    - Tambahkan `useUpdateVacancy()` menggunakan `useMutation` yang memanggil `updateVacancy` dan invalidate cache `["vacancies"]` on success
    - Tambahkan `useDeleteVacancy()` menggunakan `useMutation` yang memanggil `deleteVacancy` dan invalidate cache `["vacancies"]` on success
    - _Requirements: 10.1, 11.3, 12.2_

  - [x] 1.3 Tulis unit tests untuk `updateVacancy` dan `deleteVacancy`
    - Test bahwa `updateVacancy` mengirim `PUT` request dengan body yang benar
    - Test bahwa `deleteVacancy` mengirim `DELETE` request ke endpoint yang benar
    - Test error handling saat API mengembalikan non-ok response
    - _Requirements: 11.3, 12.2_

- [x] 2. Tambahkan tipe `VacancyFormData` ke `types/vacancy.ts`
  - Tambahkan interface `VacancyFormData` sesuai desain (title, position, jobType, candidates, deadline, location, isRemote, description, salaryMin, salaryMax, showSalary, experience)
  - Tambahkan fungsi helper `formDataToPayload(data: VacancyFormData): CreateVacancyPayload` yang melakukan pemetaan field form ke payload backend
  - _Requirements: 3.1, 3.2, 4.1, 5.1, 5.2, 6.1, 7.1, 8.1, 8.4, 8.5, 9.1_

- [x] 3. Buat komponen `VacancyForm`
  - [x] 3.1 Buat file `frontend/components/VacancyForm.tsx`
    - Implementasikan komponen dengan props `mode`, `initialData`, `onSubmit`, `isSubmitting`, `submitError`
    - Kelola semua field form dengan `useState` lokal menggunakan tipe `VacancyFormData`
    - Implementasikan validasi per field: tampilkan pesan error per field saat submit jika field wajib kosong/tidak valid, tanpa mengirim request ke API
    - Tombol "Buat lowongan" / "Simpan perubahan" disabled saat `isSubmitting`, tombol "Batal" navigasi ke `/dashboard`
    - _Requirements: 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.6, 9.1, 9.2, 9.3, 10.2, 10.5_

  - [x] 3.2 Tulis property test untuk validasi form (Property 2)
    - **Property 2: Validasi field wajib mencegah pengiriman form**
    - **Validates: Requirements 3.3, 3.4, 4.3, 5.3, 5.4, 6.4, 7.3, 8.6, 9.3, 10.5**

  - [x] 3.3 Tulis property test untuk radio button mutually exclusive (Property 3)
    - **Property 3: Radio button bersifat mutually exclusive**
    - **Validates: Requirements 4.2, 9.2**

  - [x] 3.4 Tulis property test untuk salary toggle (Property 4)
    - **Property 4: Salary toggle mengontrol payload gaji**
    - **Validates: Requirements 8.4, 8.5**

  - [x] 3.5 Tulis property test untuk checkbox remote (Property 10)
    - **Property 10: Checkbox "Bisa remote" mempertahankan pilihan lokasi**
    - **Validates: Requirements 6.3**

- [x] 4. Checkpoint — Pastikan semua tests lulus
  - Pastikan semua tests lulus, tanyakan kepada user jika ada pertanyaan.

- [x] 5. Buat komponen `ConfirmDeleteDialog`
  - Buat file `frontend/components/ConfirmDeleteDialog.tsx`
  - Implementasikan dialog modal dengan props `open`, `vacancyTitle`, `onConfirm`, `onCancel`, `isDeleting`
  - Tampilkan judul vacancy yang akan dihapus di dalam dialog
  - Tombol konfirmasi disabled saat `isDeleting`, tombol batal menutup dialog tanpa aksi
  - _Requirements: 12.1, 12.4_

- [x] 6. Buat komponen `DashboardTable`
  - Buat file `frontend/components/DashboardTable.tsx`
  - Implementasikan tabel dengan props `vacancies`, `onEdit`, `onDelete`, `onViewDetail`
  - Tampilkan kolom: Judul Lowongan, Posisi (`company`), Lokasi, Rentang Gaji (`salary_range`), dan kolom Aksi
  - Tombol "Edit" memanggil `onEdit(id)`, tombol "Hapus" memanggil `onDelete(id)`, tombol "Lihat Detail" memanggil `onViewDetail(id)`
  - _Requirements: 1.1, 1.5, 1.6, 11.1, 12.1, 13.1_

  - [x] 6.1 Tulis property test untuk DashboardTable (Property 1)
    - **Property 1: Semua vacancy dari API ditampilkan di tabel dengan kolom dan aksi yang lengkap**
    - **Validates: Requirements 1.1, 1.5, 1.6**

- [x] 7. Buat halaman `/dashboard`
  - Buat file `frontend/app/dashboard/page.tsx`
  - Gunakan hook `useVacancies()` untuk fetch data
  - Tampilkan loading state saat data dimuat, error state dengan tombol "Coba lagi" saat API gagal, empty state dengan pesan "Belum ada lowongan. Buat lowongan pertama Anda." saat daftar kosong
  - Render `DashboardTable` dengan handler `onEdit` (navigate ke `/vacancies/{id}/edit`), `onDelete` (buka `ConfirmDeleteDialog`), `onViewDetail` (navigate ke `/vacancies/{id}`)
  - Integrasikan `ConfirmDeleteDialog` dengan `useDeleteVacancy` hook
  - Tampilkan tombol "Buat Lowongan" yang mengarahkan ke `/vacancies/create`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 7.1 Tulis property test untuk penghapusan vacancy (Property 8)
    - **Property 8: Konfirmasi hapus menghilangkan vacancy dari daftar**
    - **Validates: Requirements 12.2, 12.3**

- [x] 8. Refactor halaman `/vacancies/create`
  - Ubah `frontend/app/vacancies/create/page.tsx` untuk menggunakan komponen `VacancyForm`
  - Gunakan hook `useCreateVacancy()` untuk mutasi
  - Handler `onSubmit` memanggil `formDataToPayload` lalu `mutateAsync`, redirect ke `/dashboard` on success
  - Tampilkan error dari mutation di prop `submitError` pada `VacancyForm`
  - _Requirements: 2.1, 2.2, 10.1, 10.2, 10.3, 10.4_

  - [x] 8.1 Tulis property test untuk submit create (Property 6)
    - **Property 6: Submit form create menghasilkan POST request dengan data yang benar**
    - **Validates: Requirements 10.1**

- [x] 9. Buat halaman `/vacancies/[id]/edit`
  - Buat file `frontend/app/vacancies/[id]/edit/page.tsx`
  - Gunakan hook `useVacancy(id)` untuk fetch data awal, tampilkan loading state saat fetch
  - Petakan data `Vacancy` dari API ke `VacancyFormData` sebagai `initialData` untuk `VacancyForm`
  - Gunakan hook `useUpdateVacancy()` untuk mutasi, redirect ke `/dashboard` on success
  - Jika API mengembalikan 404, redirect ke `/dashboard`
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 9.1 Tulis property test untuk pre-fill form edit (Property 5)
    - **Property 5: Form edit menampilkan data awal yang sesuai dengan data API**
    - **Validates: Requirements 11.2**

  - [x] 9.2 Tulis property test untuk submit edit (Property 7)
    - **Property 7: Submit form edit menghasilkan PUT request dengan data yang benar**
    - **Validates: Requirements 11.3**

- [x] 10. Update Navbar dan verifikasi navigasi
  - Verifikasi bahwa link "Dashboard" di `frontend/components/Navbar.tsx` sudah mengarah ke `/dashboard` (sudah ada, konfirmasi tidak ada perubahan yang diperlukan)
  - _Requirements: 2.2_

- [x] 11. Verifikasi halaman detail vacancy (Property 9)
  - [x] 11.1 Tulis property test untuk halaman detail (Property 9)
    - **Property 9: Halaman detail menampilkan semua informasi vacancy**
    - **Validates: Requirements 13.2**

- [x] 12. Checkpoint akhir — Pastikan semua tests lulus
  - Pastikan semua tests lulus, tanyakan kepada user jika ada pertanyaan.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- Property tests menggunakan library **fast-check** dengan minimum 100 iterasi per test
- Setiap property test diberi tag komentar: `// Feature: recruiter-dashboard, Property {N}: {deskripsi}`
- `formDataToPayload` adalah fungsi murni yang mudah diuji secara terpisah
