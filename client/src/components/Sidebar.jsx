import React from "react";

const Sidebar = ({ search, setSearch, selectedCategory, setSelectedCategory }) => {
  const categories = ["Technology", "Travel", "Food", "Lifestyle"];

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-6">
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Categories</h3>
        <ul className="text-sm space-y-1">
          {categories.map((category) => (
            <li
              key={category}
              className={`cursor-pointer px-2 py-1 rounded ${
                selectedCategory === category
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Language</h3>
        <button className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
          English
        </button>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Archives</h3>
        <ul className="text-sm space-y-1">
          <li>2023</li>
          <li>2022</li>
          <li>2021</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
