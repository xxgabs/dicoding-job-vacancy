/**
 * Property-based tests for Vacancy Detail page
 * Feature: recruiter-dashboard
 */

// Feature: recruiter-dashboard, Property 9: Halaman detail menampilkan semua informasi vacancy

import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { Vacancy } from '@/types/vacancy';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  notFound: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock @/lib/hooks
jest.mock('@/lib/hooks', () => ({
  useVacancy: jest.fn(),
}));

import { useParams } from 'next/navigation';
import { useVacancy } from '@/lib/hooks';
import VacancyDetailPage from '@/app/vacancies/[id]/page';

// ─── Arbitraries ────────────────────────────────────────────────────────────

const vacancyArb: fc.Arbitrary<Vacancy> = fc.record({
  id: fc.integer({ min: 1, max: 1_000_000 }),
  title: fc.string({ minLength: 1, maxLength: 80 }).filter((s) => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
  company: fc.string({ minLength: 1, maxLength: 80 }).filter((s) => s.trim().length > 0),
  location: fc.string({ minLength: 1, maxLength: 80 }).filter((s) => s.trim().length > 0),
  salary_range: fc.oneof(
    fc.constant(null),
    fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0)
  ),
  created_at: fc.constant('2024-01-01T00:00:00.000Z'),
  updated_at: fc.constant('2024-01-01T00:00:00.000Z'),
});

// ─── Property 9 ─────────────────────────────────────────────────────────────

/**
 * Property 9: Halaman detail menampilkan semua informasi vacancy
 * Validates: Requirements 13.2
 *
 * For all vacancies, the /vacancies/{id} page must display all fields stored
 * in the backend (title, company/posisi, location, salary_range, description).
 */
describe('Property 9: Halaman detail menampilkan semua informasi vacancy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title, company, location, and description for every vacancy', () => {
    fc.assert(
      fc.property(vacancyArb.filter((v) => v.salary_range === null), (vacancy) => {
        (useParams as jest.Mock).mockReturnValue({ id: String(vacancy.id) });
        (useVacancy as jest.Mock).mockReturnValue({
          data: vacancy,
          isLoading: false,
          isError: false,
        });

        const { unmount, container } = render(<VacancyDetailPage />);

        expect(container.textContent).toContain(vacancy.title);
        expect(container.textContent).toContain(vacancy.company);
        expect(container.textContent).toContain(vacancy.location);
        expect(container.textContent).toContain(vacancy.description);

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('renders salary_range when it is not null', () => {
    fc.assert(
      fc.property(
        vacancyArb.filter((v) => v.salary_range !== null && v.salary_range!.trim().length > 0),
        (vacancy) => {
          (useParams as jest.Mock).mockReturnValue({ id: String(vacancy.id) });
          (useVacancy as jest.Mock).mockReturnValue({
            data: vacancy,
            isLoading: false,
            isError: false,
          });

          const { unmount, container } = render(<VacancyDetailPage />);

          expect(container.textContent).toContain(vacancy.salary_range);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('does not render salary_range element when salary_range is null', () => {
    fc.assert(
      fc.property(vacancyArb.map((v) => ({ ...v, salary_range: null })), (vacancy) => {
        (useParams as jest.Mock).mockReturnValue({ id: String(vacancy.id) });
        (useVacancy as jest.Mock).mockReturnValue({
          data: vacancy,
          isLoading: false,
          isError: false,
        });

        const { unmount, container } = render(<VacancyDetailPage />);

        // salary_range is null — the salary badge should not appear
        // The page conditionally renders it only when salary_range is truthy
        const salaryBadge = container.querySelector('.bg-green-100');
        expect(salaryBadge).toBeNull();

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('all required fields are present in the rendered output for any vacancy', () => {
    fc.assert(
      fc.property(vacancyArb, (vacancy) => {
        (useParams as jest.Mock).mockReturnValue({ id: String(vacancy.id) });
        (useVacancy as jest.Mock).mockReturnValue({
          data: vacancy,
          isLoading: false,
          isError: false,
        });

        const { unmount, container } = render(<VacancyDetailPage />);

        const text = container.textContent ?? '';

        // title, company, location, description must always appear
        expect(text).toContain(vacancy.title);
        expect(text).toContain(vacancy.company);
        expect(text).toContain(vacancy.location);
        expect(text).toContain(vacancy.description);

        // salary_range appears only when non-null
        if (vacancy.salary_range !== null) {
          expect(text).toContain(vacancy.salary_range);
        }

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
