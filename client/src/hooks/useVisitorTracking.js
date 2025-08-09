// src/hooks/useVisitorTracking.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useVisitorTracking() {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ path: location.pathname }),
    }).catch((err) => console.error("Tracking error:", err));
  }, [location]);
}
