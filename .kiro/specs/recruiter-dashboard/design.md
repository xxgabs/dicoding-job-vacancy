# Dokumen Desain: Recruiter Dashboard

## Ikhtisar

Fitur Recruiter Dashboard menyediakan antarmuka pengelolaan lowongan pekerjaan bagi rekruter pada platform Dicoding Jobs. Fitur ini mencakup tiga halaman utama: `/dashboard` (daftar lowongan), `/vacancies/create` (form pembuatan), dan `/vacancies/[id]/edit` (form pengeditan). Frontend dibangun dengan Next.js 14 (App Router) dan berkomunikasi dengan backend Laravel melalui REST API yang sudah ada.

Karena model `Vacancy` di backend hanya memiliki field `title`, `description`, `company`, `location`, dan `salary_range`, field-field tambahan dari form (tipe pekerjaan, jumlah kandidat, deadline, pengalaman) akan diserialisasi ke dalam field `description` menggunakan format terstruktur, atau dikelola sebagai state UI saja pada iterasi pertama ini.

---

## Arsitektur

```mermaid
graph TD
    subgraph Frontend [Next.js Frontend]
        A[/dashboard] --> B[DashboardTable]
        C[/vacancies/create] --> D[VacancyForm]
        E[/vacancies/id/edit] --> D
        B --> F[ConfirmDeleteDialog]
        D --> G[RichTextEditor]
    end

    subgraph Hooks [React Query Layer]
        H[useVacancies]
        I[useVacancy]
        J[useMutation: createVacancy]
        K[useMutation: updateVacancy]
        L[useMutation: deleteVacancy]
    end

    subgraph API [lib/api.ts]
        M[getVacancies]
        N[getVacancy]
        O[createVacancy]
        P[updateVacancy]
        Q[deleteVacancy]
    end

    subgraph Backend [Laravel API]
        R[GET /api/vacancies]
        S[GET /api/vacancies/:id]
        T[POST /api/vacancies]
        U[PUT /api/vacancies/:id]
        V[DELETE /api/vacancies/:id]
    end

    B --> H
    D --> I
    D --> J
    D --> K
    B --> L
    H --> M
    I --> N
    J --> O
    K --> P
    L --> Q
    M --> R
    N --> S
    O --> T
    P --> U
    Q --> V
```

**Keputusan desain utama:**
- React Query digunakan untuk semua data fetching dan mutasi, sehingga cache invalidation otomatis setelah create/update/delete.
- State form dikelola dengan `useState` lokal di dalam `VacancyForm`.
- `VacancyForm` bersifat reusable untuk mode create dan edit, dibedakan melalui prop `mode` dan `initialData`.

---

## Komponen dan Antarmuka

### Halaman

| Halaman | Path | Deskripsi |
|---|---|---|
| DashboardPage | `/dashboard` | Menampilkan tabel semua lowongan dengan aksi per baris |
| CreateVacancyPage | `/vacancies/create` | Form pembuatan lowongan baru |
| EditVacancyPage | `/vacancies/[id]/edit` | Form pengeditan lowongan yang sudah ada |

### Komponen Baru

#### `DashboardTable`

```tsx
interface DashboardTableProps {
  vacancies: Vacancy[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetail: (id: number) => void;
}
```

Menampilkan tabel dengan kolom: Judul Lowongan, Posisi, Tipe Pekerjaan, Lokasi, Aktif Hingga, dan kolom Aksi (tombol Edit, Hapus, Lihat Detail).

#### `VacancyForm`

```tsx
interface VacancyFormProps {
  mode: "create" | "edit";
  initialData?: VacancyFormData;
  onSubmit: (data: VacancyFormData) => Promise<void>;
  isSubmitting: boolean;
  submitError?: string;
}
```

Form tunggal yang digunakan untuk create dan edit. Mengelola semua field form dengan `useState` lokal dan menjalankan validasi sebelum memanggil `onSubmit`.

#### `ConfirmDeleteDialog`

```tsx
interface ConfirmDeleteDialogProps {
  open: boolean;
  vacancyTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}
```

Dialog modal konfirmasi sebelum penghapusan. Menampilkan judul lowongan yang akan dihapus.

### Komponen yang Sudah Ada (Digunakan Ulang)

- `Hero` — digunakan di halaman create dan edit dengan judul yang sesuai.
- `Navbar` — sudah memiliki tautan ke `/dashboard`.
- `Footer` — digunakan di semua halaman.

---

## Model Data

### `VacancyFormData` (State Form Frontend)

```typescript
interface VacancyFormData {
  title: string;           // Judul Lowongan
  position: string;        // Posisi (dipetakan ke field `company` di backend)
  jobType: string;         // Tipe Pekerjaan: Full-Time | Part-Time | Kontrak | Intern
  candidates: number | ""; // Kandidat yang dibutuhkan
  deadline: string;        // Aktif hingga (format: YYYY-MM-DD)
  location: string;        // Lokasi
  isRemote: boolean;       // Bisa remote
  description: string;     // Deskripsi (rich text sebagai plain text/HTML)
  salaryMin: number | "";  // Gaji minimum
  salaryMax: number | "";  // Gaji maksimum (opsional)
  showSalary: boolean;     // Toggle tampilkan gaji
  experience: string;      // Minimum pengalaman bekerja
}
```

### Pemetaan ke `CreateVacancyPayload` (Backend)

Karena backend hanya menerima `title`, `description`, `company`, `location`, `salary_range`, pemetaan dilakukan sebagai berikut:

| Field Form | Field Backend | Keterangan |
|---|---|---|
| `title` | `title` | Langsung |
| `position` | `company` | Posisi dipetakan ke company untuk sementara |
| `description` | `description` | Konten rich text |
| `location` + `isRemote` | `location` | Jika remote: `"${location} (Remote)"` atau `"Remote"` jika lokasi kosong |
| `salaryMin` + `salaryMax` + `showSalary` | `salary_range` | Jika `showSalary=true`: `"Rp {min} - Rp {max}"`, jika false: `null` |
| `jobType`, `candidates`, `deadline`, `experience` | — | UI-only pada iterasi ini |

### Ekstensi `lib/api.ts`

```typescript
// Tambahan ke lib/api.ts
export async function updateVacancy(
  id: number,
  data: CreateVacancyPayload
): Promise<Vacancy>;

export async function deleteVacancy(id: number): Promise<void>;
```

### Ekstensi `lib/hooks.ts`

```typescript
// Tambahan mutation hooks
export function useCreateVacancy(): UseMutationResult<...>;
export function useUpdateVacancy(): UseMutationResult<...>;
export function useDeleteVacancy(): UseMutationResult<...>;
```

Setelah mutasi berhasil, cache `["vacancies"]` di-invalidate agar `DashboardTable` otomatis refresh.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Semua vacancy dari API ditampilkan di tabel dengan kolom dan aksi yang lengkap

*Untuk semua* daftar vacancy yang dikembalikan oleh API, setiap vacancy harus muncul sebagai baris di `DashboardTable` dengan kolom judul, posisi, tipe pekerjaan, lokasi, tanggal aktif hingga, serta tombol aksi "Edit", "Hapus", dan "Lihat Detail".

**Validates: Requirements 1.1, 1.5, 1.6**

---

### Property 2: Validasi field wajib mencegah pengiriman form

*Untuk semua* kombinasi state form di mana satu atau lebih field wajib (Judul Lowongan, Posisi, Tipe Pekerjaan, Kandidat ≥ 1, Aktif Hingga, Lokasi atau Remote, Deskripsi, Gaji Minimum, Minimum Pengalaman) kosong atau tidak valid, menekan tombol submit harus menampilkan pesan validasi per field dan tidak mengirim request ke API.

**Validates: Requirements 3.3, 3.4, 4.3, 5.3, 5.4, 6.4, 7.3, 8.6, 9.3, 10.5**

---

### Property 3: Radio button bersifat mutually exclusive

*Untuk semua* state form, memilih satu opsi pada field radio button (Tipe Pekerjaan atau Minimum Pengalaman Bekerja) harus memastikan semua opsi lain pada group yang sama menjadi tidak terpilih.

**Validates: Requirements 4.2, 9.2**

---

### Property 4: Salary toggle mengontrol payload gaji

*Untuk semua* nilai gaji minimum yang valid, jika `showSalary=true` maka payload yang dikirim ke API harus mengandung `salary_range` yang tidak null; jika `showSalary=false` maka payload harus mengandung `salary_range=null`.

**Validates: Requirements 8.4, 8.5**

---

### Property 5: Form edit menampilkan data awal yang sesuai dengan data API

*Untuk semua* vacancy yang ada di backend, mengakses halaman `/vacancies/{id}/edit` harus menghasilkan form dengan nilai awal setiap field yang sesuai dengan data vacancy tersebut (round-trip: fetch → pre-fill form).

**Validates: Requirements 11.2**

---

### Property 6: Submit form create menghasilkan POST request dengan data yang benar

*Untuk semua* kombinasi data form yang valid, menekan tombol "Buat lowongan" harus menghasilkan satu request `POST /api/vacancies` dengan payload yang berisi pemetaan field form yang benar.

**Validates: Requirements 10.1**

---

### Property 7: Submit form edit menghasilkan PUT request dengan data yang benar

*Untuk semua* kombinasi data form yang valid pada mode edit, menekan tombol simpan harus menghasilkan satu request `PUT /api/vacancies/{id}` dengan payload yang berisi data yang telah diperbarui.

**Validates: Requirements 11.3**

---

### Property 8: Konfirmasi hapus menghilangkan vacancy dari daftar

*Untuk semua* vacancy yang ada di daftar, setelah rekruter mengkonfirmasi penghapusan dan API mengembalikan sukses, vacancy tersebut tidak boleh lagi muncul di `DashboardTable` tanpa reload halaman.

**Validates: Requirements 12.2, 12.3**

---

### Property 9: Halaman detail menampilkan semua informasi vacancy

*Untuk semua* vacancy yang ada, halaman `/vacancies/{id}` harus menampilkan semua field yang tersimpan di backend (title, company/posisi, location, salary_range, description).

**Validates: Requirements 13.2**

---

### Property 10: Checkbox "Bisa remote" mempertahankan pilihan lokasi

*Untuk semua* pilihan lokasi yang sudah dipilih di dropdown, mencentang atau menghapus centang checkbox "Bisa remote" tidak boleh mengubah nilai pilihan lokasi di dropdown.

**Validates: Requirements 6.3**

---

## Penanganan Error

| Skenario | Penanganan |
|---|---|
| API gagal saat load daftar di `/dashboard` | Tampilkan pesan error dan tombol "Coba lagi" yang men-trigger refetch |
| API gagal saat create/update | Tampilkan pesan error di bawah form, form tetap terbuka, tombol submit aktif kembali |
| API gagal saat delete | Tampilkan pesan error, vacancy tetap di daftar, dialog ditutup |
| Vacancy tidak ditemukan saat edit (`404`) | Redirect ke `/dashboard` dengan pesan error |
| Validasi frontend gagal | Tampilkan pesan per field, tidak kirim request ke API |

---

## Strategi Pengujian

### Pendekatan Ganda

Pengujian menggunakan dua pendekatan yang saling melengkapi:

1. **Unit test** — untuk contoh spesifik, edge case, dan kondisi error.
2. **Property-based test** — untuk memverifikasi property universal di atas berbagai input yang di-generate secara acak.

### Unit Test

Fokus pada:
- Render komponen dengan data spesifik (empty state, loading state, error state)
- Navigasi: tombol Edit → `/vacancies/{id}/edit`, tombol Lihat Detail → `/vacancies/{id}`, tombol Batal → `/dashboard`
- Dialog konfirmasi: muncul saat klik Hapus, menutup saat klik Batal
- Redirect ke `/dashboard` setelah create/update berhasil
- Tampilan pesan error saat API gagal

Library: **React Testing Library** + **Jest** (sudah tersedia di ekosistem Next.js).

### Property-Based Test

Library: **fast-check** (TypeScript-native, cocok untuk Next.js/React).

Konfigurasi: minimum **100 iterasi** per property test.

Setiap property test harus diberi tag komentar dengan format:
```
// Feature: recruiter-dashboard, Property {N}: {deskripsi singkat property}
```

Pemetaan property ke test:

| Property | Test | Tag |
|---|---|---|
| Property 1 | Generate array vacancy acak → render DashboardTable → verifikasi semua baris dan kolom ada | `Property 1: Semua vacancy ditampilkan dengan kolom dan aksi lengkap` |
| Property 2 | Generate kombinasi form dengan field wajib kosong → submit → verifikasi tidak ada API call dan ada pesan validasi | `Property 2: Validasi field wajib mencegah pengiriman form` |
| Property 3 | Generate urutan klik radio button acak → verifikasi hanya satu yang terpilih | `Property 3: Radio button bersifat mutually exclusive` |
| Property 4 | Generate nilai gaji acak + state toggle → verifikasi payload | `Property 4: Salary toggle mengontrol payload gaji` |
| Property 5 | Generate vacancy acak → fetch → pre-fill form → verifikasi nilai field | `Property 5: Form edit menampilkan data awal yang sesuai` |
| Property 6 | Generate form data valid acak → submit create → verifikasi POST payload | `Property 6: Submit create menghasilkan POST request yang benar` |
| Property 7 | Generate form data valid acak → submit edit → verifikasi PUT payload | `Property 7: Submit edit menghasilkan PUT request yang benar` |
| Property 8 | Generate daftar vacancy acak → hapus satu → verifikasi tidak ada di list | `Property 8: Konfirmasi hapus menghilangkan vacancy dari daftar` |
| Property 9 | Generate vacancy acak → render halaman detail → verifikasi semua field tampil | `Property 9: Halaman detail menampilkan semua informasi vacancy` |
| Property 10 | Generate pilihan lokasi acak → toggle remote → verifikasi lokasi tidak berubah | `Property 10: Checkbox remote mempertahankan pilihan lokasi` |
