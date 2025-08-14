import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  const plainText =
    post.content?.replace(/<[^>]+>/g, "").slice(0, 100) || "No content available.";

  const postLink = `/post/${post._id}`;

  return (
    <div className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition duration-300">
      <img
        src={
          post.image
            ? post.image 
            : "https://placehold.co/600x400?text=No+Image"
        }
        alt={post.title}
        className="w-full h-52 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-1 truncate">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-2">
          {post.category || "Uncategorized"} &nbsp;|&nbsp; By{" "}
          {post.author || "Unknown"} &nbsp;|&nbsp;
          {post.date ? new Date(post.date).toLocaleDateString() : "N/A"}
        </p>

        <p className="text-gray-700 mb-3">{plainText}...</p>

        <Link
          to={postLink}
          className="inline-block text-blue-600 hover:underline font-medium"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
