import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";

import "./index.css";
import App from "./App.jsx";
console.log("VITE_ADMIN_API_KEY =", import.meta.env.VITE_ADMIN_API_KEY);

// ✅ set once, after imports
// axios.defaults.headers.common["x-admin-key"] = import.meta.env.VITE_ADMIN_API_KEY;
axios.defaults.headers.common["x-admin-key"] = "TEST123";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
