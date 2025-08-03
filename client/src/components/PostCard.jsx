import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <img
        src={post.image || "https://placehold.co/600x400?text=No+Image"}
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-2">
          {post.category} | By {post.author} |{" "}
          {new Date(post.date).toLocaleDateString()}
        </p>
        {post.context && (
          <p className="text-gray-700 mb-3">
            {post.context.slice(0, 100)}...
          </p>
        )}

        <Link
          to={`/post/${post._id}`}
          className="text-blue-600 hover:underline"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
