/**
 * Property-based tests for VacancyForm validation
 * Feature: recruiter-dashboard
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import * as fc from 'fast-check';
import VacancyForm from '@/components/VacancyForm';
import { VacancyFormData, formDataToPayload } from '@/types/vacancy';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// ─── Helpers ────────────────────────────────────────────────────────────────

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Kontrak', 'Intern'] as const;
const EXPERIENCE_OPTIONS = [
  'Kurang dari 1 tahun',
  '1-3 tahun',
  '4-5 tahun',
  '6-10 tahun',
  'Lebih dari 10 tahun',
] as const;
const POSITIONS = [
  'Frontend Developer',
  'Backend Developer',
  'Mobile Developer',
  'UI/UX Designer',
  'Data Scientist',
  'DevOps Engineer',
] as const;
const LOCATIONS = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali', 'Medan'] as const;

/** A fully valid form data object */
const validFormData: VacancyFormData = {
  title: 'Senior Engineer',
  position: 'Frontend Developer',
  jobType: 'Full-Time',
  candidates: 3,
  deadline: '2025-12-31',
  location: 'Jakarta',
  isRemote: false,
  description: 'Some description',
  salaryMin: 5000000,
  salaryMax: '',
  showSalary: true,
  experience: '1-3 tahun',
};

/** Render VacancyForm with a no-op onSubmit spy */
function renderForm(
  initialData: VacancyFormData = validFormData,
  onSubmit: jest.Mock = jest.fn()
) {
  render(
    <VacancyForm
      mode="create"
      initialData={initialData}
      onSubmit={onSubmit}
      isSubmitting={false}
    />
  );
  return onSubmit;
}

/** Click the submit button */
function clickSubmit() {
  const btn = screen.getByRole('button', { name: /buat lowongan/i });
  fireEvent.click(btn);
}

// ─── Property 2 ─────────────────────────────────────────────────────────────

// Feature: recruiter-dashboard, Property 2: Validasi field wajib mencegah pengiriman form
describe('Property 2: Validasi field wajib mencegah pengiriman form', () => {
  /**
   * Validates: Requirements 3.3, 3.4, 4.3, 5.3, 5.4, 6.4, 7.3, 8.6, 9.3, 10.5
   *
   * For all combinations of form state where one or more required fields are
   * empty/invalid, pressing submit must show validation messages and NOT call
   * the onSubmit callback.
   */

  // Arbitraries for each "invalid" variant of a required field
  const invalidTitle = fc.constantFrom('', '   ');
  const invalidPosition = fc.constant('');
  const invalidJobType = fc.constant('');
  const invalidCandidates = fc.oneof(
    fc.constant('' as const),
    fc.integer({ min: -100, max: 0 })
  );
  const invalidDeadline = fc.constant('');
  const invalidLocation = fc.constant(''); // isRemote=false, location=''
  const invalidDescription = fc.constantFrom('', '   ');
  const invalidSalaryMin = fc.constant('' as const);
  const invalidExperience = fc.constant('');

  // Arbitrary that picks at least one field to invalidate
  const invalidFormArb = fc
    .record({
      invalidateTitle: fc.boolean(),
      invalidatePosition: fc.boolean(),
      invalidateJobType: fc.boolean(),
      invalidateCandidates: fc.boolean(),
      invalidateDeadline: fc.boolean(),
      invalidateLocation: fc.boolean(),
      invalidateDescription: fc.boolean(),
      invalidateSalaryMin: fc.boolean(),
      invalidateExperience: fc.boolean(),
    })
    .filter(
      (flags) =>
        // At least one field must be invalidated
        Object.values(flags).some(Boolean)
    )
    .chain((flags) =>
      fc.record({
        title: flags.invalidateTitle ? invalidTitle : fc.constant('Senior Engineer'),
        position: flags.invalidatePosition
          ? invalidPosition
          : fc.constantFrom(...POSITIONS),
        jobType: flags.invalidateJobType
          ? invalidJobType
          : fc.constantFrom(...JOB_TYPES),
        candidates: flags.invalidateCandidates
          ? invalidCandidates
          : fc.integer({ min: 1, max: 100 }),
        deadline: flags.invalidateDeadline
          ? invalidDeadline
          : fc.constant('2025-12-31'),
        location: flags.invalidateLocation
          ? invalidLocation
          : fc.constantFrom(...LOCATIONS),
        isRemote: fc.constant(false), // keep isRemote false so location validation applies
        description: flags.invalidateDescription
          ? invalidDescription
          : fc.constant('Some description'),
        salaryMin: flags.invalidateSalaryMin
          ? invalidSalaryMin
          : fc.integer({ min: 1000000, max: 50000000 }),
        salaryMax: fc.constant('' as const),
        showSalary: fc.constant(true),
        experience: flags.invalidateExperience
          ? invalidExperience
          : fc.constantFrom(...EXPERIENCE_OPTIONS),
      })
    );

  it('should show validation errors and NOT call onSubmit for any invalid form state', () => {
    fc.assert(
      fc.property(invalidFormArb, (formData) => {
        const onSubmit = jest.fn();
        const { unmount } = render(
          <VacancyForm
            mode="create"
            initialData={formData as VacancyFormData}
            onSubmit={onSubmit}
            isSubmitting={false}
          />
        );

        clickSubmit();

        // onSubmit must NOT have been called
        expect(onSubmit).not.toHaveBeenCalled();

        // At least one validation error message must be visible
        const errorMessages = screen.queryAllByText(/wajib/i);
        expect(errorMessages.length).toBeGreaterThan(0);

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 3 ─────────────────────────────────────────────────────────────

// Feature: recruiter-dashboard, Property 3: Radio button bersifat mutually exclusive
describe('Property 3: Radio button bersifat mutually exclusive', () => {
  /**
   * Validates: Requirements 4.2, 9.2
   *
   * For all form states, selecting one option on a radio button field
   * (Tipe Pekerjaan or Minimum Pengalaman Bekerja) must ensure all other
   * options in the same group become unselected.
   */

  it('jobType radio buttons are mutually exclusive', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...JOB_TYPES),
        fc.constantFrom(...JOB_TYPES),
        (first, second) => {
          const onSubmit = jest.fn();
          const { unmount } = render(
            <VacancyForm
              mode="create"
              initialData={{ ...validFormData, jobType: '' }}
              onSubmit={onSubmit}
              isSubmitting={false}
            />
          );

          // Select first option
          const firstRadio = screen.getByDisplayValue(first);
          fireEvent.click(firstRadio);
          expect((firstRadio as HTMLInputElement).checked).toBe(true);

          // Select second option
          const secondRadio = screen.getByDisplayValue(second);
          fireEvent.click(secondRadio);
          expect((secondRadio as HTMLInputElement).checked).toBe(true);

          // All other jobType radios must be unchecked
          JOB_TYPES.forEach((type) => {
            const radio = screen.getByDisplayValue(type) as HTMLInputElement;
            if (type === second) {
              expect(radio.checked).toBe(true);
            } else {
              expect(radio.checked).toBe(false);
            }
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('experience radio buttons are mutually exclusive', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...EXPERIENCE_OPTIONS),
        fc.constantFrom(...EXPERIENCE_OPTIONS),
        (first, second) => {
          const onSubmit = jest.fn();
          const { unmount } = render(
            <VacancyForm
              mode="create"
              initialData={{ ...validFormData, experience: '' }}
              onSubmit={onSubmit}
              isSubmitting={false}
            />
          );

          // Select first option
          const firstRadio = screen.getByDisplayValue(first);
          fireEvent.click(firstRadio);
          expect((firstRadio as HTMLInputElement).checked).toBe(true);

          // Select second option
          const secondRadio = screen.getByDisplayValue(second);
          fireEvent.click(secondRadio);
          expect((secondRadio as HTMLInputElement).checked).toBe(true);

          // All other experience radios must be unchecked
          EXPERIENCE_OPTIONS.forEach((exp) => {
            const radio = screen.getByDisplayValue(exp) as HTMLInputElement;
            if (exp === second) {
              expect(radio.checked).toBe(true);
            } else {
              expect(radio.checked).toBe(false);
            }
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 4 ─────────────────────────────────────────────────────────────

// Feature: recruiter-dashboard, Property 4: Salary toggle mengontrol payload gaji
describe('Property 4: Salary toggle mengontrol payload gaji', () => {
  /**
   * Validates: Requirements 8.4, 8.5
   *
   * For all valid salary minimum values:
   * - showSalary=true  → payload.salary_range must be non-null
   * - showSalary=false → payload.salary_range must be null
   */

  const salaryMinArb = fc.integer({ min: 1, max: 100_000_000 });
  const salaryMaxArb = fc.oneof(
    fc.constant('' as const),
    fc.integer({ min: 1, max: 200_000_000 })
  );

  it('showSalary=true produces non-null salary_range in payload', () => {
    fc.assert(
      fc.property(salaryMinArb, salaryMaxArb, (salaryMin, salaryMax) => {
        const data: VacancyFormData = {
          ...validFormData,
          salaryMin,
          salaryMax,
          showSalary: true,
        };
        const payload = formDataToPayload(data);
        expect(payload.salary_range).not.toBeNull();
        expect(typeof payload.salary_range).toBe('string');
      }),
      { numRuns: 100 }
    );
  });

  it('showSalary=false produces null salary_range in payload', () => {
    fc.assert(
      fc.property(salaryMinArb, salaryMaxArb, (salaryMin, salaryMax) => {
        const data: VacancyFormData = {
          ...validFormData,
          salaryMin,
          salaryMax,
          showSalary: false,
        };
        const payload = formDataToPayload(data);
        expect(payload.salary_range).toBeNull();
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 10 ────────────────────────────────────────────────────────────

// Feature: recruiter-dashboard, Property 10: Checkbox "Bisa remote" mempertahankan pilihan lokasi
describe('Property 10: Checkbox "Bisa remote" mempertahankan pilihan lokasi', () => {
  /**
   * Validates: Requirements 6.3
   *
   * For all location choices already selected in dropdown, checking or
   * unchecking "Bisa remote" checkbox must NOT change the location dropdown value.
   */

  it('toggling isRemote does not change location in formDataToPayload output location base', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...LOCATIONS),
        fc.boolean(), // initial isRemote state
        (location, initialRemote) => {
          // Build form data with a chosen location and initial remote state
          const dataWithRemote: VacancyFormData = {
            ...validFormData,
            location,
            isRemote: true,
          };
          const dataWithoutRemote: VacancyFormData = {
            ...validFormData,
            location,
            isRemote: false,
          };

          // The location base value must be preserved regardless of isRemote
          const payloadRemote = formDataToPayload(dataWithRemote);
          const payloadNoRemote = formDataToPayload(dataWithoutRemote);

          // Both payloads must contain the original location string
          expect(payloadRemote.location).toContain(location);
          expect(payloadNoRemote.location).toContain(location);

          // The location with remote should have "(Remote)" appended
          expect(payloadRemote.location).toBe(`${location} (Remote)`);
          // The location without remote should be the plain location
          expect(payloadNoRemote.location).toBe(location);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('toggling isRemote checkbox in rendered form does not change location dropdown value', () => {
    fc.assert(
      fc.property(fc.constantFrom(...LOCATIONS), (location) => {
        const onSubmit = jest.fn();
        const { unmount } = render(
          <VacancyForm
            mode="create"
            initialData={{ ...validFormData, location, isRemote: false }}
            onSubmit={onSubmit}
            isSubmitting={false}
          />
        );

        // Verify initial location dropdown value
        const locationSelect = screen.getByDisplayValue(location) as HTMLSelectElement;
        expect(locationSelect.value).toBe(location);

        // Toggle the "Bisa remote" checkbox
        const remoteCheckbox = screen.getByRole('checkbox');
        fireEvent.click(remoteCheckbox);

        // Location dropdown value must remain unchanged
        expect(locationSelect.value).toBe(location);

        // Toggle back
        fireEvent.click(remoteCheckbox);
        expect(locationSelect.value).toBe(location);

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
