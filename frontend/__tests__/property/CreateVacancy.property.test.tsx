/**
 * Property-based tests for Create Vacancy form submission
 * Feature: recruiter-dashboard
 */

// Feature: recruiter-dashboard, Property 6: Submit form create menghasilkan POST request dengan data yang benar

import * as fc from 'fast-check';
import { formDataToPayload, VacancyFormData } from '@/types/vacancy';

const POSITIONS = [
  'Frontend Developer',
  'Backend Developer',
  'Mobile Developer',
  'UI/UX Designer',
  'Data Scientist',
  'DevOps Engineer',
] as const;

const LOCATIONS = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali', 'Medan'] as const;

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Kontrak', 'Intern'] as const;

const EXPERIENCE_OPTIONS = [
  'Kurang dari 1 tahun',
  '1-3 tahun',
  '4-5 tahun',
  '6-10 tahun',
  'Lebih dari 10 tahun',
] as const;

/** Arbitrary for a fully valid VacancyFormData */
const validFormDataArb: fc.Arbitrary<VacancyFormData> = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
  position: fc.constantFrom(...POSITIONS),
  jobType: fc.constantFrom(...JOB_TYPES),
  candidates: fc.integer({ min: 1, max: 100 }),
  deadline: fc.constant('2025-12-31'),
  location: fc.constantFrom(...LOCATIONS),
  isRemote: fc.boolean(),
  description: fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0),
  salaryMin: fc.integer({ min: 1_000_000, max: 50_000_000 }),
  salaryMax: fc.oneof(
    fc.constant('' as const),
    fc.integer({ min: 50_000_001, max: 200_000_000 })
  ),
  showSalary: fc.boolean(),
  experience: fc.constantFrom(...EXPERIENCE_OPTIONS),
});

/**
 * Property 6: Submit form create menghasilkan POST request dengan data yang benar
 * Validates: Requirements 10.1
 *
 * For all combinations of valid form data, formDataToPayload must produce
 * a payload with the correct field mappings:
 * - title → title
 * - position → company
 * - description → description
 * - location + isRemote → location (with "(Remote)" suffix when isRemote=true)
 * - salaryMin + salaryMax + showSalary → salary_range (non-null when showSalary=true, null when false)
 */
describe('Property 6: Submit form create menghasilkan POST request dengan data yang benar', () => {
  it('title maps directly to payload.title', () => {
    fc.assert(
      fc.property(validFormDataArb, (data) => {
        const payload = formDataToPayload(data);
        expect(payload.title).toBe(data.title);
      }),
      { numRuns: 100 }
    );
  });

  it('position maps to payload.company', () => {
    fc.assert(
      fc.property(validFormDataArb, (data) => {
        const payload = formDataToPayload(data);
        expect(payload.company).toBe(data.position);
      }),
      { numRuns: 100 }
    );
  });

  it('description maps directly to payload.description', () => {
    fc.assert(
      fc.property(validFormDataArb, (data) => {
        const payload = formDataToPayload(data);
        expect(payload.description).toBe(data.description);
      }),
      { numRuns: 100 }
    );
  });

  it('location with isRemote=true maps to "<location> (Remote)"', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...LOCATIONS),
        (location) => {
          const data: VacancyFormData = {
            title: 'Test',
            position: 'Frontend Developer',
            jobType: 'Full-Time',
            candidates: 1,
            deadline: '2025-12-31',
            location,
            isRemote: true,
            description: 'desc',
            salaryMin: 5_000_000,
            salaryMax: '',
            showSalary: true,
            experience: '1-3 tahun',
          };
          const payload = formDataToPayload(data);
          expect(payload.location).toBe(`${location} (Remote)`);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('location with isRemote=false maps to plain location string', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...LOCATIONS),
        (location) => {
          const data: VacancyFormData = {
            title: 'Test',
            position: 'Frontend Developer',
            jobType: 'Full-Time',
            candidates: 1,
            deadline: '2025-12-31',
            location,
            isRemote: false,
            description: 'desc',
            salaryMin: 5_000_000,
            salaryMax: '',
            showSalary: true,
            experience: '1-3 tahun',
          };
          const payload = formDataToPayload(data);
          expect(payload.location).toBe(location);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('showSalary=true produces non-null salary_range containing salaryMin', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1_000_000, max: 50_000_000 }),
        fc.oneof(fc.constant('' as const), fc.integer({ min: 50_000_001, max: 200_000_000 })),
        (salaryMin, salaryMax) => {
          const data: VacancyFormData = {
            title: 'Test',
            position: 'Frontend Developer',
            jobType: 'Full-Time',
            candidates: 1,
            deadline: '2025-12-31',
            location: 'Jakarta',
            isRemote: false,
            description: 'desc',
            salaryMin,
            salaryMax,
            showSalary: true,
            experience: '1-3 tahun',
          };
          const payload = formDataToPayload(data);
          expect(payload.salary_range).not.toBeNull();
          expect(payload.salary_range).toContain(`Rp ${salaryMin}`);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('showSalary=false produces null salary_range', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1_000_000, max: 50_000_000 }),
        fc.oneof(fc.constant('' as const), fc.integer({ min: 50_000_001, max: 200_000_000 })),
        (salaryMin, salaryMax) => {
          const data: VacancyFormData = {
            title: 'Test',
            position: 'Frontend Developer',
            jobType: 'Full-Time',
            candidates: 1,
            deadline: '2025-12-31',
            location: 'Jakarta',
            isRemote: false,
            description: 'desc',
            salaryMin,
            salaryMax,
            showSalary: false,
            experience: '1-3 tahun',
          };
          const payload = formDataToPayload(data);
          expect(payload.salary_range).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('salaryMax included in salary_range when provided and showSalary=true', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1_000_000, max: 50_000_000 }),
        fc.integer({ min: 50_000_001, max: 200_000_000 }),
        (salaryMin, salaryMax) => {
          const data: VacancyFormData = {
            title: 'Test',
            position: 'Frontend Developer',
            jobType: 'Full-Time',
            candidates: 1,
            deadline: '2025-12-31',
            location: 'Jakarta',
            isRemote: false,
            description: 'desc',
            salaryMin,
            salaryMax,
            showSalary: true,
            experience: '1-3 tahun',
          };
          const payload = formDataToPayload(data);
          expect(payload.salary_range).toContain(`Rp ${salaryMax}`);
        }
      ),
      { numRuns: 100 }
    );
  });
});
