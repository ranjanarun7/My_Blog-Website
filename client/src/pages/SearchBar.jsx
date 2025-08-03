import React from "react";

const SearchBar = ({ search, setSearch }) => (
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search posts..."
    className="w-full p-2 border mb-4"
  />
);

export default SearchBar;
