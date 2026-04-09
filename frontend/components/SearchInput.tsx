interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <input
      data-testid="search-input"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  );
}
