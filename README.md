# Dicoding Job Vacancy

A job vacancy platform built with Next.js (frontend) and Laravel (backend).

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Query
- **Backend**: Laravel 11, SQLite

## Project Structure

```
dicoding-job-vacancy/
├── backend/    # Laravel REST API
└── frontend/   # Next.js app
```

---

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm

---

## Setup

### 1. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Backend runs at `http://localhost:8000`

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then start the dev server:

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## Running Tests

### Backend — Unit & Feature Tests (PHPUnit)

```bash
cd backend
php artisan test
```

To run a specific suite:

```bash
# Unit tests only
php artisan test --testsuite=Unit

# Feature tests only
php artisan test --testsuite=Feature
```

### Frontend — Unit & Integration Tests (Jest)

```bash
cd frontend
npm test
```

To run once without watch mode:

```bash
cd frontend
npx jest --no-coverage --passWithNoTests
```

To run a specific test file:

```bash
cd frontend
npx jest --no-coverage __tests__/api.test.ts
```

### Frontend — End-to-End Tests (Playwright)

Make sure both backend and frontend are running first, then:

```bash
cd frontend
npx playwright install   # first time only
npm run test:e2e
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/vacancies` | List all vacancies |
| GET | `/api/vacancies?title=x` | Search by title |
| GET | `/api/vacancies/{id}` | Get vacancy detail |
| POST | `/api/vacancies` | Create vacancy |
| PUT | `/api/vacancies/{id}` | Update vacancy |
| DELETE | `/api/vacancies/{id}` | Delete vacancy |
