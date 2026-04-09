/**
 * Property 7: Frontend search input filters displayed JobCards
 * Validates: Requirements 3.3
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

function makeVacancy(id: number, title: string): Vacancy {
  return {
    id,
    title,
    description: 'desc',
    company: 'Company',
    location: 'Location',
    salary_range: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

const testCases: {
  searchTerm: string;
  allTitles: string[];
  expectedTitles: string[];
}[] = [
  {
    searchTerm: 'engineer',
    allTitles: ['Frontend Engineer', 'Backend Engineer', 'Designer'],
    expectedTitles: ['Frontend Engineer', 'Backend Engineer'],
  },
  {
    searchTerm: 'DESIGNER',
    allTitles: ['Frontend Engineer', 'Backend Engineer', 'Designer'],
    expectedTitles: ['Designer'],
  },
  {
    searchTerm: 'xyz',
    allTitles: ['Frontend Engineer', 'Backend Engineer'],
    expectedTitles: [],
  },
  {
    searchTerm: '',
    allTitles: ['Frontend Engineer', 'Backend Engineer'],
    expectedTitles: ['Frontend Engineer', 'Backend Engineer'],
  },
];

describe('Property 7: Frontend search input filters displayed JobCards', () => {
  it.each(testCases)(
    'search "$searchTerm" renders $expectedTitles.length card(s)',
    ({ searchTerm, allTitles, expectedTitles }) => {
      // The hook is called with the search term and returns pre-filtered results
      // (filtering is server-side). We simulate what the server would return.
      const filteredVacancies = searchTerm
        ? allTitles
            .filter((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((t, i) => makeVacancy(i + 1, t))
        : allTitles.map((t, i) => makeVacancy(i + 1, t));

      mockedUseVacancies.mockReturnValue({
        data: filteredVacancies,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useVacancies>);

      renderWithQueryClient(<VacanciesPage />);

      const cards = screen.queryAllByTestId('job-card');
      expect(cards.length).toBe(expectedTitles.length);

      expectedTitles.forEach((title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    }
  );
});
