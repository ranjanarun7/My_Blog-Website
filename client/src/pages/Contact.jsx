import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! (Check console for data)');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col items-center py-10 px-4 box-border font-sans">
      <h1 className="text-5xl font-bold text-gray-800 mb-2 text-center">Get in Touch</h1>
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-wrap gap-16 max-w-6xl w-full justify-center box-border">
        <div className="flex-1 min-w-[300px]">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h3>
          <div className="flex items-center mb-4 text-lg text-gray-700">
            <span className="mr-3 text-2xl">📧</span>
            <span>akyBlog@gmail.com</span>
          </div>
          <div className="flex items-center mb-4 text-lg text-gray-700">
            <span className="mr-3 text-2xl">📞</span>
            <span>+91 9867764545</span>
          </div>
          <div className="flex items-center mb-4 text-lg text-gray-700">
            <span className="mr-3 text-2xl">📍</span>
            <span>Pune, Maharashtra</span>
          </div>
        </div>
        <form className="flex-1 min-w-[350px]" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="name" className="block text-base text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-400 transition-colors duration-300"
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="block text-base text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-400 transition-colors duration-300"
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="message" className="block text-base text-gray-700 font-medium mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base min-h-[120px] resize-y focus:outline-none focus:border-blue-400 transition-colors duration-300"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-lg border-none text-lg font-bold cursor-pointer transition-colors duration-300 block mx-auto w-fit"
          >
            Send Message
          </button>
        </form>
      </div>
      <div className="mt-10 flex justify-center mb-5">
        <a href="#"><FaTwitter className="text-white cursor-pointer text-3xl hover:text-gray-800 transition-colors duration-200 mx-3" /></a>
        <a href="#"><FaInstagram className="text-white cursor-pointer text-3xl hover:text-gray-800 transition-colors duration-200 mx-3" /></a>
        <a href="#"><FaFacebookF className="text-white cursor-pointer text-3xl hover:text-gray-800 transition-colors duration-200 mx-3" /></a>
        <a href="#"><FaGithub className="text-white cursor-pointer text-3xl hover:text-gray-800 transition-colors duration-200 mx-3" /></a>
      </div>
      <div className="flex gap-2 mt-5">
        <span className="w-3 h-3 rounded-full bg-orange-500"></span>
        <span className="w-3 h-3 rounded-full bg-blue-400"></span>
        <span className="w-3 h-3 rounded-full bg-white"></span>
        <span className="w-3 h-3 rounded-full bg-orange-300"></span>
      </div>
    </div>
  );
};

export default Contact;