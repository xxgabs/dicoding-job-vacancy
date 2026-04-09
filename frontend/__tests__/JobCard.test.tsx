import { render, screen } from '@testing-library/react';
import JobCard from '@/components/JobCard';
import { Vacancy } from '@/types/vacancy';

const mockVacancy: Vacancy = {
  id: 1,
  title: 'Senior Frontend Engineer',
  description: 'Build great UIs',
  company: 'Acme Corp',
  location: 'Remote',
  salary_range: '$100k - $130k',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('JobCard', () => {
  it('renders the vacancy title', () => {
    render(<JobCard vacancy={mockVacancy} />);
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
  });

  it('renders the company name', () => {
    render(<JobCard vacancy={mockVacancy} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('renders the location', () => {
    render(<JobCard vacancy={mockVacancy} />);
    expect(screen.getByText('Remote')).toBeInTheDocument();
  });
});
