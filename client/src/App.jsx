import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState,useEffect } from "react";

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
import ReactGA from "react-ga4";

ReactGA.initialize("G-NTGSK850SN");
function Layout() {
  const location = useLocation();

  // ✅ Filters for Sidebar
  const [search, setSearch] = useState("");
  const [archiveYear, setArchiveYear] = useState("");
  const [language, setLanguage] = useState("English");

  // ✅ Sidebar toggle state (mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ✅ Only show Sidebar on specific pages
  const showSidebar = ["/", "/post"].some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-col md:flex-row gap-4 p-4 relative">
        {/* ✅ Main Content */}
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
          </Routes>
        </div>

        {/* ✅ Sidebar */}
        {showSidebar && (
          <div
            className={`
              fixed top-16 right-0 z-40 bg-white w-64 h-full p-4 shadow-lg
              transform transition-transform duration-300
              ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
              md:static md:transform-none md:w-72 md:h-auto md:block
            `}
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
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
