import React from 'react';

function FilterBar({ activeFilter, onFilterChange }) {
  const filters = ['All', 'Placed', 'Unplaced'];

  return (
    <div className="flex justify-center space-x-4 mb-8">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-6 py-2 rounded-full transition-colors ${
            activeFilter === filter
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;