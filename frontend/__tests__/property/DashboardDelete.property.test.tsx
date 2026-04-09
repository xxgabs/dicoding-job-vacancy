/**
 * Property-based tests for dashboard vacancy deletion
 * Feature: recruiter-dashboard
 */

// Feature: recruiter-dashboard, Property 8: Konfirmasi hapus menghilangkan vacancy dari daftar

/**
 * Validates: Requirements 12.2, 12.3
 *
 * For all vacancies in the list, after the recruiter confirms deletion and the
 * API returns success, that vacancy must no longer appear in DashboardTable
 * without page reload.
 *
 * We test DashboardTable directly: after removing a vacancy from the array
 * passed to DashboardTable, that vacancy's title must no longer appear in the
 * rendered table.
 */

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

/** Generate an array of vacancies with unique ids (at least 1 item) */
const vacancyArrayArb: fc.Arbitrary<Vacancy[]> = fc
  .array(vacancyArb, { minLength: 1, maxLength: 20 })
  .map((vacancies) => {
    const seen = new Set<number>();
    return vacancies.filter((v) => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });
  })
  .filter((vacancies) => vacancies.length > 0);

// ─── Property 8 ─────────────────────────────────────────────────────────────

describe('Property 8: Konfirmasi hapus menghilangkan vacancy dari daftar', () => {
  it('after removing a vacancy from the list, its title no longer appears in DashboardTable', () => {
    fc.assert(
      fc.property(
        vacancyArrayArb,
        fc.integer({ min: 0, max: 19 }),
        (vacancies, indexSeed) => {
          const indexToDelete = indexSeed % vacancies.length;
          const vacancyToDelete = vacancies[indexToDelete];

          // Simulate state after successful deletion: remove the vacancy from the array
          const remainingVacancies = vacancies.filter((v) => v.id !== vacancyToDelete.id);

          const { unmount, container } = render(
            <DashboardTable
              vacancies={remainingVacancies}
              onEdit={jest.fn()}
              onDelete={jest.fn()}
              onViewDetail={jest.fn()}
            />
          );

          const withinContainer = within(container);

          // The deleted vacancy's title must NOT appear in the title column (col 0),
          // UNLESS another remaining vacancy shares the same title.
          const titleStillInList = remainingVacancies.some(
            (v) => v.title.trim() === vacancyToDelete.title.trim()
          );
          if (!titleStillInList) {
            // Only check the title column (first <td> in each row, class text-gray-900)
            const titleCells = withinContainer.queryAllByText(vacancyToDelete.title.trim());
            const titleColumnCells = titleCells.filter(
              (el) => el.tagName === 'TD' && el.classList.contains('text-gray-900')
            );
            expect(titleColumnCells).toHaveLength(0);
          }

          // All remaining vacancies must still appear
          remainingVacancies.forEach((v) => {
            const cells = withinContainer.queryAllByText(v.title.trim());
            const remaining = cells.filter((el) => el.closest('td') !== null);
            expect(remaining.length).toBeGreaterThanOrEqual(1);
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('table row count decreases by 1 after a vacancy is removed', () => {
    fc.assert(
      fc.property(
        vacancyArrayArb,
        fc.integer({ min: 0, max: 19 }),
        (vacancies, indexSeed) => {
          const indexToDelete = indexSeed % vacancies.length;
          const vacancyToDelete = vacancies[indexToDelete];
          const remainingVacancies = vacancies.filter((v) => v.id !== vacancyToDelete.id);

          // Render with full list
          const { unmount: unmount1, container: container1 } = render(
            <DashboardTable
              vacancies={vacancies}
              onEdit={jest.fn()}
              onDelete={jest.fn()}
              onViewDetail={jest.fn()}
            />
          );
          const rowsBefore = within(container1).getAllByRole('row').length;
          unmount1();

          // Render with vacancy removed
          const { unmount: unmount2, container: container2 } = render(
            <DashboardTable
              vacancies={remainingVacancies}
              onEdit={jest.fn()}
              onDelete={jest.fn()}
              onViewDetail={jest.fn()}
            />
          );
          const rowsAfter = within(container2).getAllByRole('row').length;
          unmount2();

          // Should have exactly 1 fewer row (the deleted vacancy's row)
          expect(rowsAfter).toBe(rowsBefore - 1);
        }
      ),
      { numRuns: 100 }
    );
  });
});
