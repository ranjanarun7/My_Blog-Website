import React from "react";

const SearchBar = ({ search, setSearch }) => (
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search posts..."
    aria-label="Search posts"
    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
  />
);

export default SearchBar;
