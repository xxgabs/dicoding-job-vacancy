/**
 * Property-based tests for Edit Vacancy page
 * Feature: recruiter-dashboard
 */

// Feature: recruiter-dashboard, Property 5: Form edit menampilkan data awal yang sesuai dengan data API
// Feature: recruiter-dashboard, Property 7: Submit form edit menghasilkan PUT request yang benar

import * as fc from 'fast-check';
import { formDataToPayload, VacancyFormData, Vacancy } from '@/types/vacancy';
import { vacancyToFormData } from '@/app/vacancies/[id]/edit/page';

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

/** Arbitrary for a Vacancy from the API */
const vacancyArb: fc.Arbitrary<Vacancy> = fc.record({
  id: fc.integer({ min: 1, max: 10000 }),
  title: fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0),
  company: fc.constantFrom(...POSITIONS),
  location: fc.oneof(
    fc.constantFrom(...LOCATIONS),
    fc.constantFrom(...LOCATIONS).map((loc) => `${loc} (Remote)`)
  ),
  salary_range: fc.oneof(
    fc.constant(null),
    fc.integer({ min: 1_000_000, max: 50_000_000 }).map((min) => `Rp ${min}`),
    fc.tuple(
      fc.integer({ min: 1_000_000, max: 50_000_000 }),
      fc.integer({ min: 50_000_001, max: 200_000_000 })
    ).map(([min, max]) => `Rp ${min} - Rp ${max}`)
  ),
  created_at: fc.constant('2024-01-01T00:00:00.000Z'),
  updated_at: fc.constant('2024-01-01T00:00:00.000Z'),
});

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
 * Property 5: Form edit menampilkan data awal yang sesuai dengan data API
 * Validates: Requirements 11.2
 */
describe('Property 5: Form edit menampilkan data awal yang sesuai dengan data API', () => {
  it('vacancy.title maps to formData.title', () => {
    fc.assert(
      fc.property(vacancyArb, (vacancy) => {
        const formData = vacancyToFormData(vacancy);
        expect(formData.title).toBe(vacancy.title);
      }),
      { numRuns: 100 }
    );
  });

  it('vacancy.company maps to formData.position', () => {
    fc.assert(
      fc.property(vacancyArb, (vacancy) => {
        const formData = vacancyToFormData(vacancy);
        expect(formData.position).toBe(vacancy.company);
      }),
      { numRuns: 100 }
    );
  });

  it('vacancy.description maps to formData.description', () => {
    fc.assert(
      fc.property(vacancyArb, (vacancy) => {
        const formData = vacancyToFormData(vacancy);
        expect(formData.description).toBe(vacancy.description);
      }),
      { numRuns: 100 }
    );
  });

  it('vacancy.location ending with " (Remote)" sets isRemote=true and strips suffix', () => {
    fc.assert(
      fc.property(fc.constantFrom(...LOCATIONS), (loc) => {
        const vacancy: Vacancy = {
          id: 1,
          title: 'Test',
          description: 'desc',
          company: 'Frontend Developer',
          location: `${loc} (Remote)`,
          salary_range: null,
          created_at: '',
          updated_at: '',
        };
        const formData = vacancyToFormData(vacancy);
        expect(formData.isRemote).toBe(true);
        expect(formData.location).toBe(loc);
      }),
      { numRuns: 100 }
    );
  });

  it('vacancy.location not ending with " (Remote)" sets isRemote=false and keeps location unchanged', () => {
    fc.assert(
      fc.property(fc.constantFrom(...LOCATIONS), (loc) => {
        const vacancy: Vacancy = {
          id: 1,
          title: 'Test',
          description: 'desc',
          company: 'Frontend Developer',
          location: loc,
          salary_range: null,
          created_at: '',
          updated_at: '',
        };
        const formData = vacancyToFormData(vacancy);
        expect(formData.isRemote).toBe(false);
        expect(formData.location).toBe(loc);
      }),
      { numRuns: 100 }
    );
  });

  it('vacancy.salary_range not null sets showSalary=true', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1_000_000, max: 50_000_000 }),
        (min) => {
          const vacancy: Vacancy = {
            id: 1,
            title: 'Test',
            description: 'desc',
            company: 'Frontend Developer',
            location: 'Jakarta',
            salary_range: `Rp ${min}`,
            created_at: '',
            updated_at: '',
          };
          const formData = vacancyToFormData(vacancy);
          expect(formData.showSalary).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('vacancy.salary_range null sets showSalary=false', () => {
    fc.assert(
      fc.property(vacancyArb.map((v) => ({ ...v, salary_range: null })), (vacancy) => {
        const formData = vacancyToFormData(vacancy);
        expect(formData.showSalary).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 7: Submit form edit menghasilkan PUT request dengan data yang benar
 * Validates: Requirements 11.3
 */
describe('Property 7: Submit form edit menghasilkan PUT request yang benar', () => {
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
      fc.property(fc.constantFrom(...LOCATIONS), (location) => {
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
      }),
      { numRuns: 100 }
    );
  });

  it('location with isRemote=false maps to plain location string', () => {
    fc.assert(
      fc.property(fc.constantFrom(...LOCATIONS), (location) => {
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
      }),
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
});
