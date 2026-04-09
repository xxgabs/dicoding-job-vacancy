import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInput from '@/components/SearchInput';

describe('SearchInput', () => {
  it('renders an input with the given value', () => {
    render(<SearchInput value="react" onChange={() => {}} />);
    expect(screen.getByTestId('search-input')).toHaveValue('react');
  });

  it('calls onChange with the new value when the user types', async () => {
    const handleChange = jest.fn();
    render(<SearchInput value="" onChange={handleChange} />);

    const input = screen.getByTestId('search-input');
    await userEvent.type(input, 'h');

    expect(handleChange).toHaveBeenCalledWith('h');
  });
});
