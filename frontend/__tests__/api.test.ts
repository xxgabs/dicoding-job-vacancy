import { updateVacancy, deleteVacancy } from '@/lib/api';
import { CreateVacancyPayload, Vacancy } from '@/types/vacancy';

const BASE_URL = 'http://localhost:8000';

const mockVacancy: Vacancy = {
  id: 5,
  title: 'Frontend Engineer',
  description: 'Build UIs with React',
  company: 'Dicoding',
  location: 'Bandung',
  salary_range: 'Rp 5000000 - Rp 8000000',
  created_at: '2024-01-01T00:00:00.000000Z',
  updated_at: '2024-01-02T00:00:00.000000Z',
};

const mockPayload: CreateVacancyPayload = {
  title: 'Frontend Engineer',
  description: 'Build UIs with React',
  company: 'Dicoding',
  location: 'Bandung',
  salary_range: 'Rp 5000000 - Rp 8000000',
};

describe('updateVacancy', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sends PUT request to correct URL with JSON body', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVacancy,
    });

    await updateVacancy(5, mockPayload);

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/vacancies/5`,
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockPayload),
      })
    );
  });

  it('returns parsed JSON from response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVacancy,
    });

    const result = await updateVacancy(5, mockPayload);

    expect(result).toEqual(mockVacancy);
  });

  it('throws error when API returns non-ok response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 422,
    });

    await expect(updateVacancy(5, mockPayload)).rejects.toThrow(
      'Failed to update vacancy 5: 422'
    );
  });

  it('throws error on 404 response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(updateVacancy(99, mockPayload)).rejects.toThrow(
      'Failed to update vacancy 99: 404'
    );
  });
});

describe('deleteVacancy', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sends DELETE request to correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    await deleteVacancy(5);

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/vacancies/5`,
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('resolves with void on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const result = await deleteVacancy(5);

    expect(result).toBeUndefined();
  });

  it('throws error when API returns non-ok response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(deleteVacancy(5)).rejects.toThrow(
      'Failed to delete vacancy 5: 500'
    );
  });

  it('throws error on 404 response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(deleteVacancy(99)).rejects.toThrow(
      'Failed to delete vacancy 99: 404'
    );
  });
});
