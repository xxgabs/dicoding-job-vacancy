import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VacancyDetailPage from '@/app/vacancies/[id]/page';
import { Vacancy } from '@/types/vacancy';

jest.mock('@/lib/hooks', () => ({
  useVacancy: jest.fn(),
}));

const mockNotFound = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '42' }),
  notFound: () => mockNotFound(),
}));

import { useVacancy } from '@/lib/hooks';

const mockedUseVacancy = useVacancy as jest.MockedFunction<typeof useVacancy>;

const mockVacancy: Vacancy = {
  id: 42,
  title: 'Backend Engineer',
  description: 'Build APIs with Laravel',
  company: 'Dicoding',
  location: 'Bandung',
  salary_range: '5,000,000 – 8,000,000 IDR',
  created_at: '2024-01-15T08:00:00.000000Z',
  updated_at: '2024-01-15T08:00:00.000000Z',
};

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe('VacancyDetailPage', () => {
  beforeEach(() => {
    mockNotFound.mockClear();
  });

  it('renders all vacancy fields when data is loaded', () => {
    mockedUseVacancy.mockReturnValue({
      data: mockVacancy,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useVacancy>);

    renderWithQueryClient(<VacancyDetailPage />);

    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Build APIs with Laravel')).toBeInTheDocument();
    expect(screen.getByText('Dicoding')).toBeInTheDocument();
    expect(screen.getByText('Bandung')).toBeInTheDocument();
    expect(screen.getByText('5,000,000 – 8,000,000 IDR')).toBeInTheDocument();
    expect(screen.getByText(/Diposting:/i)).toBeInTheDocument();
  });

  it('calls notFound() when isError is true', () => {
    mockedUseVacancy.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useVacancy>);

    renderWithQueryClient(<VacancyDetailPage />);

    expect(mockNotFound).toHaveBeenCalled();
  });
});
