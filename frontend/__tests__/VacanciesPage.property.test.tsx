/**
 * Property 5: Frontend renders one JobCard per vacancy
 * Validates: Requirements 2.3
 */

import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VacanciesPage from '@/app/vacancies/page';
import { Vacancy } from '@/types/vacancy';

jest.mock('@/lib/hooks', () => ({
  useVacancies: jest.fn(),
}));

import { useVacancies } from '@/lib/hooks';

const mockedUseVacancies = useVacancies as jest.MockedFunction<typeof useVacancies>;

function makeMockVacancies(n: number): Vacancy[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    title: `Job ${i + 1}`,
    description: `Description ${i + 1}`,
    company: `Company ${i + 1}`,
    location: `Location ${i + 1}`,
    salary_range: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }));
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe('Property 5: Frontend renders one JobCard per vacancy', () => {
  it.each([0, 1, 2, 5, 10, 20])(
    'renders exactly %i JobCard(s) for %i vacancies',
    (n) => {
      const vacancies = makeMockVacancies(n);
      mockedUseVacancies.mockReturnValue({
        data: vacancies,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useVacancies>);

      renderWithQueryClient(<VacanciesPage />);

      expect(screen.queryAllByTestId('job-card').length).toBe(n);
    }
  );
});
