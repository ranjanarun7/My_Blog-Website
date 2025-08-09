import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import useVisitorTracking from "./hooks/useVisitorTracking"; // ✅ NEW

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import SinglePost from "./pages/SinglePost";
import AdminAnalytics from "./pages/AdminAnalytics";
function Layout() {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [archiveYear, setArchiveYear] = useState("");
  const [language, setLanguage] = useState("English");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const showSidebar = ["/", "/post"].some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-col md:flex-row gap-4 p-4 relative">
        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  search={search}
                  archiveYear={archiveYear}
                  language={language}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/post/:id" element={<SinglePost />} />

            {/* ✅ New Admin Route */}
            <Route path="/admin" element={<AdminAnalytics />} />
          </Routes>
        </div>

        {showSidebar && (
          <div
            className={`fixed top-16 right-0 z-40 bg-white w-64 h-full p-4 shadow-lg
              transform transition-transform duration-300
              ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
              md:static md:transform-none md:w-72 md:h-auto md:block`}
          >
            <Sidebar
              search={search}
              setSearch={setSearch}
              archiveYear={archiveYear}
              setArchiveYear={setArchiveYear}
              language={language}
              setLanguage={setLanguage}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  useVisitorTracking(); // ✅ tracking trigger yahan
  return <Layout />;
}
