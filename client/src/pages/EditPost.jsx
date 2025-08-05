import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("active");
  const [image, setImage] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`)
      .then((res) => {
        const post = res.data;
        setTitle(post.title || "");
        setContent(post.content || "");
        setStatus(post.status || "draft");
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        alert("Failed to load post data.");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", status);
    if (image) formData.append("image", image);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Post updated successfully!");
      navigate("/");
    } catch (err) {
      console.error("❌ Error updating post:", err);
      alert("Update failed. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Content:</label>
            <Editor
              apiKey="hzqxq6992erm01lm4aro2lyvomqr1wdey40hjhek6ybujf40"
              value={content}
              onEditorChange={(value) => setContent(value)}
              init={{
                height: 300,
                menubar: true,
                plugins: [
                  "advlist", "autolink", "lists", "link", "image", "media",
                  "table", "code", "fullscreen", "help", "wordcount"
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | removeformat | help",
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Replace Image (optional):</label>
            <input
              type="file"
              className="w-full p-2 border rounded"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Status:</label>
            <select
              className="w-full p-2 border rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Update Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
