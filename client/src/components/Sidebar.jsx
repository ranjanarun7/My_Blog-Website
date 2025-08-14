import React, { useEffect, useState } from "react";

const Sidebar = ({
  search,
  setSearch,
  setArchiveYear,
  archiveYear,
  language,
  setLanguage,
}) => {
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const archives = ["2025", "2024", "2023"];
  const languages = ["English", "Hindi"];
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(debouncedSearch);
    }, 500);
    return () => clearTimeout(timeout);
  }, [debouncedSearch]);

  const handleArchiveClick = (year) => {
    setArchiveYear(archiveYear === year ? "" : year);
  };

  const handleLanguageSwitch = () => {
    const nextLanguage = language === "English" ? "Hindi" : "English";
    setLanguage(nextLanguage);
  };

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setArchiveYear("");
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-6">
      <div>
        <input
          type="text"
          value={debouncedSearch}
          onChange={(e) => setDebouncedSearch(e.target.value)}
          placeholder="Search posts..."
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Language</h3>
        <button
          onClick={handleLanguageSwitch}
          className="text-sm text-gray-700 bg-gray-200 px-3 py-1 rounded"
        >
          {language}
        </button>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Archives</h3>
        <ul className="text-sm space-y-1">
          {archives.map((year) => (
            <li
              key={year}
              className={`cursor-pointer px-2 py-1 rounded transition ${
                archiveYear === year
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleArchiveClick(year)}
            >
              {year}
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-2">
        <button
          onClick={handleResetFilters}
          className="text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
