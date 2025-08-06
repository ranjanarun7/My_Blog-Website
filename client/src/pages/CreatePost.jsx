import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

const CreatePost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    language: "",
    status: "draft", // default
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditorChange = (newContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    if (image) {
      payload.append("image", image); // ✅ Cloudinary-compatible field name
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Post created successfully");
      navigate("/");
    } catch (err) {
      console.error("❌ Error creating post:", err);
      setError("Failed to create post.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">📝 Create New Post</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* ✅ TinyMCE Editor */}
        <Editor
          apiKey="hzqxq6992erm01lm4aro2lyvomqr1wdey40hjhek6ybujf40"
          value={formData.content}
          onEditorChange={handleEditorChange}
          init={{
            height: 300,
            menubar: true,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | formatselect | bold italic backcolor | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | removeformat | help",
          }}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          className="w-full p-2 border rounded"
          value={formData.category}
          onChange={handleChange}
        />

        <input
          type="text"
          name="language"
          placeholder="Language"
          className="w-full p-2 border rounded"
          value={formData.language}
          onChange={handleChange}
        />

        <select
          name="status"
          className="w-full p-2 border rounded"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded border"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
