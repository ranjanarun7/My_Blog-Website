import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";

const Home = ({ search = "", archiveYear = "", language = "" }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts`, {
        params: {
          search,
          year: archiveYear,
          language,
        },
      })
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
        setError("❌ Failed to fetch posts.");
        setLoading(false);
      });
  }, [search, archiveYear, language]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = search
      ? post.title?.toLowerCase().includes(search.toLowerCase())
      : true;

    const postYear = post.createdAt
      ? new Date(post.createdAt).getFullYear().toString()
      : "";
    const matchesYear = archiveYear ? postYear === archiveYear : true;

    const matchesLanguage = language
      ? post.language?.toLowerCase() === language.toLowerCase()
      : true;

    return matchesSearch && matchesYear && matchesLanguage;
  });

  return (
    <div className="w-full px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Latest Posts</h2>

      {/* 🔄 Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* ❌ Error Message */}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* ✅ Posts Grid */}
      {!loading && !error && (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <p className="text-center col-span-full">No posts found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
