# Dokumen Persyaratan

## Pendahuluan

Fitur Recruiter Dashboard pada platform Dicoding Jobs memungkinkan rekruter untuk mengelola lowongan pekerjaan secara mandiri melalui halaman `/dashboard`. Rekruter dapat membuat lowongan baru melalui form yang lengkap, melihat daftar semua lowongan, mengedit detail lowongan, menghapus lowongan, dan melihat detail lowongan. Dashboard ini terintegrasi dengan API CRUD backend Laravel dan antarmuka Next.js.

## Glossary

- **Dashboard**: Halaman `/dashboard` pada frontend Next.js yang menjadi pusat pengelolaan lowongan bagi rekruter.
- **Rekruter**: Pengguna platform Dicoding Jobs yang berperan sebagai pembuat dan pengelola lowongan pekerjaan.
- **Vacancy**: Entitas lowongan pekerjaan yang memiliki field lengkap sesuai Vacancy_Form.
- **Vacancy_API**: Backend Laravel yang menyediakan endpoint REST: `GET /api/vacancies`, `POST /api/vacancies`, `GET /api/vacancies/{id}`, `PUT /api/vacancies/{id}`, `DELETE /api/vacancies/{id}`.
- **Vacancy_List**: Komponen tabel di Dashboard yang menampilkan semua Vacancy beserta aksi per baris.
- **Vacancy_Form**: Form pembuatan/pengeditan Vacancy di halaman `/vacancies/create` dan `/vacancies/{id}/edit`.
- **Confirmation_Dialog**: Dialog konfirmasi yang muncul sebelum tindakan destruktif seperti penghapusan Vacancy.
- **Hero_Banner**: Bagian banner gelap di bagian atas halaman Vacancy_Form.
- **Navbar**: Navigasi utama yang memuat logo eJobs, tautan "Lowongan Kerja", dan tautan "Dashboard".
- **Rich_Text_Editor**: Area teks dengan toolbar pemformatan yang mendukung Bold, Italic, Underline, Link, List, dan Code.
- **Salary_Toggle**: Tombol toggle yang mengontrol visibilitas informasi gaji pada lowongan yang dipublikasikan.

---

## Requirements

### Requirement 1: Menampilkan Daftar Lowongan di Dashboard

**User Story:** Sebagai rekruter, saya ingin melihat semua lowongan di halaman dashboard, sehingga saya dapat memantau dan mengelola lowongan yang telah dibuat.

#### Acceptance Criteria

1. WHEN rekruter mengakses halaman `/dashboard`, THE Dashboard SHALL menampilkan Vacancy_List yang memuat semua Vacancy yang tersedia dari Vacancy_API.
2. WHEN Vacancy_API mengembalikan daftar kosong, THE Dashboard SHALL menampilkan pesan "Belum ada lowongan. Buat lowongan pertama Anda." kepada rekruter.
3. WHILE data Vacancy sedang dimuat dari Vacancy_API, THE Dashboard SHALL menampilkan indikator loading kepada rekruter.
4. IF Vacancy_API mengembalikan error, THEN THE Dashboard SHALL menampilkan pesan error yang informatif dan tombol untuk mencoba ulang.
5. THE Vacancy_List SHALL menampilkan kolom berikut untuk setiap Vacancy: judul lowongan, posisi, tipe pekerjaan, lokasi, dan tanggal aktif hingga.
6. THE Vacancy_List SHALL menyediakan tombol aksi "Edit", "Hapus", dan "Lihat Detail" pada setiap baris Vacancy.
7. THE Dashboard SHALL menyediakan tombol "Buat Lowongan" yang mengarahkan rekruter ke halaman `/vacancies/create`.

### Requirement 2: Struktur Halaman Form Lowongan

**User Story:** Sebagai rekruter, saya ingin halaman pembuatan lowongan memiliki tampilan yang konsisten dan informatif, sehingga saya dapat mengisi form dengan mudah.

#### Acceptance Criteria

1. WHEN rekruter mengakses halaman `/vacancies/create`, THE Vacancy_Form SHALL menampilkan Hero_Banner dengan judul "Buat lowongan pekerjaan" dan subjudul "Dicoding Jobs menghubungkan industri dengan talenta yang tepat. Mencari tim baru tidak harus melelahkan dan boros biaya."
2. THE Navbar SHALL menampilkan logo eJobs, tautan "Lowongan Kerja", dan tautan "Dashboard" pada semua halaman.
3. THE Vacancy_Form SHALL menampilkan tombol "Buat lowongan" berwarna biru sebagai aksi utama dan tombol "Batal" bergaya outline sebagai aksi sekunder di bagian bawah form.
4. WHEN rekruter menekan tombol "Batal", THE Vacancy_Form SHALL mengarahkan rekruter kembali ke halaman `/dashboard`.

### Requirement 3: Field Form Lowongan — Judul dan Posisi

**User Story:** Sebagai rekruter, saya ingin mengisi judul dan posisi lowongan dengan panduan yang jelas, sehingga informasi dasar lowongan dapat diisi dengan benar.

#### Acceptance Criteria

1. THE Vacancy_Form SHALL menyediakan field "Judul Lowongan" bertipe text input yang wajib diisi, dengan placeholder "Masukkan judul lowongan" dan teks bantuan "Contoh: Android Native Developer" di bawah field.
2. THE Vacancy_Form SHALL menyediakan field "Posisi" bertipe dropdown/select yang wajib diisi, dengan placeholder "Pilih posisi yang dicari" sebagai opsi default yang tidak dapat dipilih.
3. WHEN rekruter mencoba menyimpan Vacancy_Form dengan field "Judul Lowongan" kosong, THE Vacancy_Form SHALL menampilkan pesan validasi yang menyatakan field tersebut wajib diisi.
4. WHEN rekruter mencoba menyimpan Vacancy_Form dengan field "Posisi" belum dipilih, THE Vacancy_Form SHALL menampilkan pesan validasi yang menyatakan field tersebut wajib diisi.

### Requirement 4: Field Form Lowongan — Tipe Pekerjaan

**User Story:** Sebagai rekruter, saya ingin memilih tipe pekerjaan dari pilihan yang sudah ditentukan, sehingga kandidat dapat menyaring lowongan berdasarkan tipe pekerjaan.

#### Acceptance Criteria

1. THE Vacancy_Form SHALL menyediakan field "Tipe Pekerjaan" bertipe radio button yang wajib diisi, dengan tepat 4 opsi dalam urutan berikut: "Full-Time", "Part-Time", "Kontrak", "Intern".
2. THE Vacancy_Form SHALL memastikan hanya satu opsi Tipe Pekerjaan yang dapat dipilih pada satu waktu.
3. WHEN rekruter mencoba menyimpan Vacancy_Form tanpa memilih Tipe Pekerjaan, THE Vacancy_Form SHALL menampilkan pesan validasi yang menyatakan field tersebut wajib diisi.

### Requirement 5: Field Form Lowongan — Kandidat dan Tanggal Aktif

**User Story:** Sebagai rekruter, saya ingin menentukan jumlah kandidat yang dibutuhkan dan batas waktu lowongan, sehingga proses rekrutmen dapat direncanakan dengan baik.

#### Acceptance Criteria

1. THE Vacancy_Form SHALL menyediakan field "Kandidat yang dibutuhkan" bertipe number input yang wajib diisi, dengan placeholder "Masukkan jumlah kandidat yang dibutuhkan" dan nilai minimum 1.
2. THE Vacancy_Form SHALL menyediakan field "Aktif hingga" bertipe date picker yang wajib diisi, dengan format tampilan dd/mm/yyyy.
3. WHEN rekruter mencoba menyimpan Vacancy_Form dengan field "Kandidat yang dibutuhkan" kosong atau bernilai kurang dari 1, THE Vacancy_Form SHALL menampilkan pesan validasi yang sesuai.
4. WHEN rekruter mencoba menyimpan Vacancy_Form dengan field "Aktif hingga" kosong, THE Vacancy_Form SHALL menampilkan pesan validasi yang menyatakan field tersebut wajib diisi.

### Requirement 6: Field Form Lowongan — Lokasi

**User Story:** Sebagai rekruter, saya ingin menentukan lokasi pekerjaan dan opsi remote, sehingga kandidat dapat mengetahui fleksibilitas lokasi kerja.

#### Acceptance Criteria

1. THE Vacancy_Form SHALL menyediakan field "Lokasi" bertipe dropdown/select, dengan placeholder "Pilih lokasi" sebagai opsi default yang tidak dapat dipilih.
2. THE Vacancy_Form SHALL menyediakan checkbox berlabel "Bisa remote" di bawah dropdown Lokasi.
3. WHEN rekruter mencentang checkbox "Bisa remote", THE Vacancy_Form SHALL mempertahankan pilihan lokasi yang sudah dipilih dan menambahkan informasi remote pada data yang dikirim.
4. WHEN rekruter mencoba menyimpan Vacancy_Form dengan field "Lokasi" belum dipilih dan checkbox "Bisa remote" tidak dicentang, THE Vacancy_Form SHALL menampilkan pesan validasi yang menyatakan lokasi wajib diisi.

### Requirement 7: Field Form Lowongan — Deskripsi

**User Story:** Sebagai rekruter, saya ingin menulis deskripsi pekerjaan dengan pemformatan teks yang kaya, sehingga informasi lowongan dapat disajikan secara terstruktur dan menarik.

#### Acceptance Criteria

1. THE Vacancy_Form SHALL menyediakan field "Deskripsi" menggunakan Rich_Text_Editor yang wajib diisi.
2. THE Rich_Text_Editor SHALL menyediakan toolbar pemformatan dengan tepat 6 aksi dalam urutan berikut: Bold (B), Italic (I), Underline (U), Link (🔗), List (≡), Code (`</>`).
3. WHEN rekruter mencoba menyimpan Vacancy_Form dengan field "Deskripsi" kosong, THE Vacancy_Form SHALL menampilkan pesan validasi yang menyatakan field tersebut wajib diisi.

### Requirement 8: Field Form Lowongan — Rentang Gaji

**User Story:** Sebagai rekruter, saya ingin mengisi rentang gaji dan mengontrol visibilitasnya, sehingga kandidat dapat mengetahui ekspektasi gaji sesuai kebijakan perusahaan.

#### Acceptance Criteria

1. THE Vacancy_Form SHALL menyediakan field "Rentang gaji per bulan" yang wajib diisi, terdiri dari dua number input: input "Minimum" dengan prefiks "Rp" dan input "Maximum" dengan prefiks "Rp" yang berlabel "opsional".
2. THE Vacancy_Form SHALL menyediakan Salary_Toggle berlabel "Tampilkan gaji" di bawah input rentang gaji.
3. THE Vacancy_Form SHALL menampilkan teks bantuan "Gaji akan ditampilkan di lowongan pekerjaan dan dapat dilihat oleh kandidat." di bawah Salary_Toggle.
4. WHEN Salary_Toggle dalam kondisi aktif, THE Vacancy_Form SHALL menyertakan informasi gaji pada data Vacancy yang dikirim ke Vacancy_API.
5. WHEN Salary_Toggle dalam kondisi nonaktif, THE Vacancy_Form SHALL mengirim data Vacancy ke Vacancy_API tanpa menyertakan informasi gaji.
6. WHEN rekruter mencoba menyimpan Vacancy_Form dengan field "Minimum" gaji kosong, THE Vacancy_Form SHALL menampilkan pesan validasi yang menyatakan field tersebut wajib diisi.

### Requirement 9: Field Form Lowongan — Minimum Pengalaman Bekerja

**User Story:** Sebagai rekruter, saya ingin menentukan minimum pengalaman kerja yang dibutuhkan, sehingga kandidat yang melamar sesuai dengan kualifikasi yang diharapkan.

#### Acceptance Criteria

1. THE Vacancy_Form SHALL menyediakan field "Minimum pengalaman bekerja" bertipe radio button yang wajib diisi, dengan tepat 5 opsi dalam urutan berikut: "Kurang dari 1 tahun", "1-3 tahun", "4-5 tahun", "6-10 tahun", "Lebih dari 10 tahun".
2. THE Vacancy_Form SHALL memastikan hanya satu opsi Minimum Pengalaman Bekerja yang dapat dipilih pada satu waktu.
3. WHEN rekruter mencoba menyimpan Vacancy_Form tanpa memilih Minimum Pengalaman Bekerja, THE Vacancy_Form SHALL menampilkan pesan validasi yang menyatakan field tersebut wajib diisi.

### Requirement 10: Pengiriman dan Validasi Form Lowongan

**User Story:** Sebagai rekruter, saya ingin mendapatkan umpan balik yang jelas saat mengisi form secara tidak lengkap, sehingga saya dapat memperbaiki kesalahan sebelum data dikirim.

#### Acceptance Criteria

1. WHEN rekruter menekan tombol "Buat lowongan" dengan semua field wajib terisi dengan benar, THE Vacancy_Form SHALL mengirim request `POST /api/vacancies` ke Vacancy_API dengan seluruh data form.
2. WHILE Vacancy_Form sedang mengirim data ke Vacancy_API, THE Vacancy_Form SHALL menonaktifkan tombol "Buat lowongan" dan menampilkan indikator loading untuk mencegah pengiriman duplikat.
3. WHEN Vacancy_API berhasil membuat Vacancy baru, THE Vacancy_Form SHALL mengarahkan rekruter ke halaman `/dashboard`.
4. IF Vacancy_API mengembalikan error saat pembuatan Vacancy, THEN THE Vacancy_Form SHALL menampilkan pesan error yang spesifik tanpa menutup form.
5. WHEN rekruter mencoba menyimpan Vacancy_Form dengan satu atau lebih field wajib yang kosong, THE Vacancy_Form SHALL menampilkan pesan validasi per field sebelum mengirim data ke Vacancy_API.

### Requirement 11: Mengedit Lowongan yang Ada

**User Story:** Sebagai rekruter, saya ingin mengedit detail lowongan yang sudah ada, sehingga informasi lowongan selalu akurat dan terkini.

#### Acceptance Criteria

1. WHEN rekruter menekan tombol "Edit" pada sebuah Vacancy di Vacancy_List, THE Dashboard SHALL mengarahkan rekruter ke halaman `/vacancies/{id}/edit`.
2. WHEN rekruter mengakses halaman `/vacancies/{id}/edit`, THE Vacancy_Form SHALL menampilkan data Vacancy yang sudah ada sebagai nilai awal pada setiap field.
3. WHEN rekruter menyimpan perubahan pada Vacancy_Form, THE Vacancy_Form SHALL mengirim request `PUT /api/vacancies/{id}` ke Vacancy_API dengan data yang telah diperbarui.
4. WHEN Vacancy_API berhasil memperbarui Vacancy, THE Vacancy_Form SHALL mengarahkan rekruter kembali ke halaman `/dashboard`.
5. IF Vacancy_API mengembalikan error saat update, THEN THE Vacancy_Form SHALL menampilkan pesan error yang spesifik tanpa menutup form.

### Requirement 12: Menghapus Lowongan

**User Story:** Sebagai rekruter, saya ingin menghapus lowongan yang sudah tidak relevan, sehingga daftar lowongan tetap bersih dan akurat.

#### Acceptance Criteria

1. WHEN rekruter menekan tombol "Hapus" pada sebuah Vacancy di Vacancy_List, THE Dashboard SHALL menampilkan Confirmation_Dialog yang meminta konfirmasi penghapusan.
2. WHEN rekruter mengkonfirmasi penghapusan pada Confirmation_Dialog, THE Dashboard SHALL mengirim request `DELETE /api/vacancies/{id}` ke Vacancy_API.
3. WHEN Vacancy_API berhasil menghapus Vacancy, THE Dashboard SHALL menghapus Vacancy tersebut dari Vacancy_List tanpa memuat ulang halaman.
4. WHEN rekruter membatalkan penghapusan pada Confirmation_Dialog, THE Dashboard SHALL menutup Confirmation_Dialog tanpa melakukan perubahan apapun.
5. IF Vacancy_API mengembalikan error saat penghapusan, THEN THE Dashboard SHALL menampilkan pesan error kepada rekruter dan mempertahankan Vacancy di Vacancy_List.

### Requirement 13: Navigasi ke Detail Lowongan

**User Story:** Sebagai rekruter, saya ingin melihat detail lengkap sebuah lowongan dari dashboard, sehingga saya dapat memverifikasi informasi yang telah dipublikasikan.

#### Acceptance Criteria

1. WHEN rekruter menekan tombol "Lihat Detail" pada sebuah Vacancy di Vacancy_List, THE Dashboard SHALL mengarahkan rekruter ke halaman `/vacancies/{id}`.
2. WHEN rekruter mengakses halaman `/vacancies/{id}`, THE Dashboard SHALL menampilkan seluruh informasi Vacancy termasuk semua field yang diisi pada Vacancy_Form.
