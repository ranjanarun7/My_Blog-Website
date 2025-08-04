import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";

const Home = ({ search, selectedCategory }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts`)
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch posts");
        setLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory
      ? post.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-center">{error}</p>
      )}

      {/* Posts */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
