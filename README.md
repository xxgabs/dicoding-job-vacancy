# Dicoding Job Vacancy

A job vacancy platform built with Next.js (frontend) and Laravel (backend).

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Query
- **Backend**: Laravel 11, SQLite

---

## Local Development

### Prerequisites

- Node.js 18+
- PHP 8.2+
- Composer

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Backend runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## Deployment

### Backend → Railway

1. Go to [railway.app](https://railway.app) and login with GitHub
2. Click **New Project** → **Deploy from GitHub repo** → select this repo
3. Set **Root Directory** to `backend`
4. Go to **Variables** tab and add the following:

| Variable | Value |
|---|---|
| `APP_NAME` | `DicodingJobs` |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | `base64:te7uc3ZZbY4u4AyWhkTTO046JjSRs3aV8t0Ac0iO5f4=` |
| `DB_CONNECTION` | `sqlite` |
| `CORS_ALLOWED_ORIGINS` | `https://your-vercel-url.vercel.app` |

5. Go to **Settings** → **Domains** → copy the Railway URL (e.g. `https://xxx.up.railway.app`)

> Note: Update `CORS_ALLOWED_ORIGINS` after you get your Vercel URL in the next step.

---

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) and login with GitHub
2. Click **Add New Project** → import this repo
3. Set **Root Directory** to `frontend`
4. Under **Environment Variables**, add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://your-railway-url.up.railway.app` |

5. Click **Deploy**
6. Copy the Vercel URL (e.g. `https://your-project.vercel.app`)

---

### Final Step: Connect Frontend ↔ Backend

After both are deployed:

1. Go back to **Railway** → your backend project → **Variables**
2. Update `CORS_ALLOWED_ORIGINS` to your actual Vercel URL:
   ```
   CORS_ALLOWED_ORIGINS=https://your-project.vercel.app
   ```
3. Railway will auto-redeploy. Done.

---

## Project Structure

```
dicoding-job-vacancy/
├── backend/          # Laravel API
│   ├── app/
│   ├── database/
│   ├── routes/api.php
│   └── ...
└── frontend/         # Next.js app
    ├── app/
    ├── components/
    ├── lib/
    └── types/
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/vacancies` | List all vacancies |
| GET | `/api/vacancies?title=x` | Search by title |
| GET | `/api/vacancies/{id}` | Get vacancy detail |
| POST | `/api/vacancies` | Create vacancy |
| PUT | `/api/vacancies/{id}` | Update vacancy |
| DELETE | `/api/vacancies/{id}` | Delete vacancy |
