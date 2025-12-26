// src/components/SearchBar.tsx
type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
}: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <button onClick={onSearch} style={{ marginLeft: 8 }}>
        Search
      </button>
    </div>
  );
}