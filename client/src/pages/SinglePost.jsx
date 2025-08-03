import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import.meta.env.VITE_API_URL
import { useEffect, useState } from "react";

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Post deleted successfully");
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (!post) return <div>Loading...</div>;

  const isAuthor = user && post.authorId === user._id;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6">
      <img
        src={post.image || "https://placehold.co/600x400?text=No+Image"}
        alt={post.title}
        className="w-full h-64 object-cover mb-4 rounded"
      />
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-600 mb-4">
        {post.category} | By {post.author} |{" "}
        {new Date(post.date).toLocaleDateString()}
      </p>
      <p className="mb-6">{post.context}</p>

      {isAuthor && (
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/edit/${id}`)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default SinglePost;
