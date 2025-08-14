import { useParams, useNavigate,Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowLeft } from 'lucide-react';

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`) 
      .then((res) => setPost(res.data))
      .catch((err) => {
        console.error("Error fetching post:", err);
        navigate("/"); 
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
    <div>
      <Link to="/">
        <ArrowLeft />
      </Link>
            
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6 mt-8">
        
        <img
          src={
            post.image
              ? post.image
              : "https://placehold.co/600x400?text=No+Image"
          }
          alt={post.title}
          className="w-full h-52 object-cover rounded"
        />

        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-600 mb-4 text-sm">
          {post.category || "Uncategorized"} &nbsp;|&nbsp;
          {post.language || "Unknown Language"} &nbsp;|&nbsp;
          By {post.author || "Unknown"} &nbsp;|&nbsp;
          {post.date ? new Date(post.date).toLocaleDateString() : "Date N/A"}
        </p>

        <div
          className="prose prose-lg max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {isAuthor && (
          <div className="flex gap-6">
            <button
              onClick={() => navigate(`/edit/${post._id}`)}
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
    </div>
  );
};

export default SinglePost;
