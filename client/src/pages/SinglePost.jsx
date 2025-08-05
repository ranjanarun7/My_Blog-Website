import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const SinglePost = () => {
  const { id } = useParams(); // This will now only be the MongoDB _id
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`) // ✅ Using _id directly
      .then((res) => setPost(res.data))
      .catch((err) => {
        console.error("Error fetching post:", err);
        navigate("/"); // Redirect on error
      });
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("🗑️ Post deleted successfully");
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete the post.");
    }
  };

  if (!post) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const isAuthor = user && post.authorId === user._id;

  if (post.status !== "published" && !isAuthor) {
    return (
      <div className="text-center mt-10 text-gray-600">
        ⚠️ This post is inactive.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6 mt-8">
      {/* 🖼️ Image */}
      <img
        src={
          post.image
            ? `${import.meta.env.VITE_API_URL}/uploads/${post.image}`
            : "https://placehold.co/600x400?text=No+Image"
        }
        alt={post.title}
        className="w-full h-52 object-cover"
      />

      {/* 📝 Title */}
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

      {/* 🧾 Meta Info */}
      <p className="text-gray-600 mb-4 text-sm">
        {post.category || "Uncategorized"} &nbsp;|&nbsp;
        {post.language || "Unknown Language"} &nbsp;|&nbsp;
        By {post.author || "Unknown"} &nbsp;|&nbsp;
        {post.date ? new Date(post.date).toLocaleDateString() : "Date N/A"}
      </p>

      {/* 📄 Content */}
      <div
        className="prose prose-lg max-w-none mb-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* ✏️ Author Actions */}
      {isAuthor && (
        <div className="flex gap-6">
          <button
            onClick={() => navigate(`/edit/${post._id}`)} // ✅ Use _id instead of slug
            className="text-blue-600 hover:underline font-semibold"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:underline font-semibold"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default SinglePost;
