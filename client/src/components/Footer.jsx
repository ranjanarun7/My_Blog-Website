import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-100 mt-8 border-t">
      <p className="text-sm text-gray-600">Copyright/blog.com</p>
      <div className="flex gap-4 mt-2 md:mt-0">
        <FaFacebookF className="text-white bg-black rounded-full p-1 cursor-pointer text-2xl" />
        <FaTwitter className="text-white bg-black rounded-full p-1 cursor-pointer text-2xl" />
        <FaInstagram className="text-white bg-black rounded-full p-1 cursor-pointer text-2xl" />
        <FaGithub className="text-white bg-black rounded-full p-1 cursor-pointer text-2xl" />
      </div>
    </footer>
  );
};

export default Footer;
