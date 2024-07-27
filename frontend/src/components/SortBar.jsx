import React from 'react';

const SortBar = ({ sortOption, setSortOption }) => {
  return (
    <div className="sort-bar" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
      <label htmlFor="sort" style={{ marginRight: '10px' }}>Sort by:</label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
      >
        <option value="rating">Rating</option>
        <option value="year">Year</option>
      </select>
    </div>
  );
};

export default SortBar;
