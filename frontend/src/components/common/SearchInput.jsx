import React from 'react';

const SearchInput = ({ value, onChange, placeholder, className = '' }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`p-2 border border-gray-300 rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
      aria-label={placeholder}
    />
  );
};

export default SearchInput;
