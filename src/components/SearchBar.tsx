import React from 'react';

type SearchBarProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Rechercher...'}
      />
      {value && <button type="button" onClick={() => onChange('')}>✕</button>}
    </div>
  );
};