/**
 * Property-based tests for DashboardTable
 * Feature: recruiter-dashboard
 */

// Feature: recruiter-dashboard, Property 1: Semua vacancy ditampilkan dengan kolom dan aksi lengkap

import { render, screen, within } from '@testing-library/react';
import * as fc from 'fast-check';
import DashboardTable from '@/components/DashboardTable';
import { Vacancy } from '@/types/vacancy';

// ─── Arbitraries ────────────────────────────────────────────────────────────

const vacancyArb: fc.Arbitrary<Vacancy> = fc.record({
  id: fc.integer({ min: 1, max: 1_000_000 }),
  title: fc.string({ minLength: 1, maxLength: 80 }).filter((s) => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 200 }),
  company: fc.string({ minLength: 1, maxLength: 80 }).filter((s) => s.trim().length > 0),
  location: fc.string({ minLength: 1, maxLength: 80 }).filter((s) => s.trim().length > 0),
  salary_range: fc.oneof(
    fc.constant(null),
    fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0)
  ),
  created_at: fc.constant('2024-01-01T00:00:00.000Z'),
  updated_at: fc.constant('2024-01-01T00:00:00.000Z'),
});

/** Generate an array of vacancies with unique ids */
const vacancyArrayArb: fc.Arbitrary<Vacancy[]> = fc
  .array(vacancyArb, { minLength: 1, maxLength: 20 })
  .map((vacancies) => {
    // Ensure unique ids
    const seen = new Set<number>();
    return vacancies.filter((v) => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });
  })
  .filter((vacancies) => vacancies.length > 0);

// ─── Property 1 ─────────────────────────────────────────────────────────────

describe('Property 1: Semua vacancy dari API ditampilkan di tabel dengan kolom dan aksi yang lengkap', () => {
  /**
   * Validates: Requirements 1.1, 1.5, 1.6
   *
   * For all arrays of vacancies returned by the API, every vacancy must appear
   * as a row in DashboardTable with title, position (company), location,
   * salary_range columns, and "Edit", "Hapus", "Lihat Detail" action buttons.
   */

  it('every vacancy appears as a row with all required columns and action buttons', () => {
    fc.assert(
      fc.property(vacancyArrayArb, (vacancies) => {
        const onEdit = jest.fn();
        const onDelete = jest.fn();
        const onViewDetail = jest.fn();

        const { unmount, container } = render(
          <DashboardTable
            vacancies={vacancies}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetail={onViewDetail}
          />
        );

        const withinContainer = within(container);

        // Verify table headers are present (scoped to this render's container)
        expect(withinContainer.getAllByText('Judul Lowongan').length).toBeGreaterThanOrEqual(1);
        expect(withinContainer.getAllByText('Posisi').length).toBeGreaterThanOrEqual(1);
        expect(withinContainer.getAllByText('Lokasi').length).toBeGreaterThanOrEqual(1);
        expect(withinContainer.getAllByText('Rentang Gaji').length).toBeGreaterThanOrEqual(1);
        expect(withinContainer.getAllByText('Aksi').length).toBeGreaterThanOrEqual(1);

        // Verify every vacancy has a row with all required data and action buttons
        const rows = withinContainer.getAllByRole('row');
        // rows[0] is the header row, data rows start at index 1
        expect(rows.length).toBe(vacancies.length + 1);

        // Each data row must contain the vacancy data and action buttons
        const dataRows = rows.slice(1);
        dataRows.forEach((row, index) => {
          const vacancy = vacancies[index];
          const cells = within(row).getAllByRole('cell');

          // Column 0: Judul Lowongan (title)
          expect(cells[0].textContent?.trim()).toBe(vacancy.title.trim());
          // Column 1: Posisi (company)
          expect(cells[1].textContent?.trim()).toBe(vacancy.company.trim());
          // Column 2: Lokasi (location)
          expect(cells[2].textContent?.trim()).toBe(vacancy.location.trim());
          // Column 3: Rentang Gaji (salary_range or "-")
          expect(cells[3].textContent?.trim()).toBe(
            vacancy.salary_range != null ? vacancy.salary_range.trim() : '-'
          );

          // Action buttons must be present in column 4
          expect(within(row).getByRole('button', { name: /edit/i })).toBeInTheDocument();
          expect(within(row).getByRole('button', { name: /hapus/i })).toBeInTheDocument();
          expect(within(row).getByRole('button', { name: /lihat detail/i })).toBeInTheDocument();
        });

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('Edit button calls onEdit with the correct vacancy id', () => {
    fc.assert(
      fc.property(vacancyArrayArb, (vacancies) => {
        const onEdit = jest.fn();
        const onDelete = jest.fn();
        const onViewDetail = jest.fn();

        const { unmount } = render(
          <DashboardTable
            vacancies={vacancies}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetail={onViewDetail}
          />
        );

        const rows = screen.getAllByRole('row').slice(1);
        rows.forEach((row, index) => {
          const editBtn = within(row).getByRole('button', { name: /edit/i });
          editBtn.click();
          expect(onEdit).toHaveBeenCalledWith(vacancies[index].id);
        });

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('Hapus button calls onDelete with the correct vacancy id', () => {
    fc.assert(
      fc.property(vacancyArrayArb, (vacancies) => {
        const onEdit = jest.fn();
        const onDelete = jest.fn();
        const onViewDetail = jest.fn();

        const { unmount } = render(
          <DashboardTable
            vacancies={vacancies}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetail={onViewDetail}
          />
        );

        const rows = screen.getAllByRole('row').slice(1);
        rows.forEach((row, index) => {
          const hapusBtn = within(row).getByRole('button', { name: /hapus/i });
          hapusBtn.click();
          expect(onDelete).toHaveBeenCalledWith(vacancies[index].id);
        });

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('Lihat Detail button calls onViewDetail with the correct vacancy id', () => {
    fc.assert(
      fc.property(vacancyArrayArb, (vacancies) => {
        const onEdit = jest.fn();
        const onDelete = jest.fn();
        const onViewDetail = jest.fn();

        const { unmount } = render(
          <DashboardTable
            vacancies={vacancies}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetail={onViewDetail}
          />
        );

        const rows = screen.getAllByRole('row').slice(1);
        rows.forEach((row, index) => {
          const detailBtn = within(row).getByRole('button', { name: /lihat detail/i });
          detailBtn.click();
          expect(onViewDetail).toHaveBeenCalledWith(vacancies[index].id);
        });

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
