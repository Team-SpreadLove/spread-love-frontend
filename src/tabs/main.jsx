import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "../styles/globals.css";
import { settingsRouter } from "./settingsRouter.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={settingsRouter} />
  </StrictMode>,
);
