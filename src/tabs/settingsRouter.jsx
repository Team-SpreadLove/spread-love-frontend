import { createHashRouter, Navigate } from "react-router";
import Settings from "./Settings.jsx";
import GeneralPage from "../pages/GeneralPage.jsx";
import InfoPage from "../pages/InfoPage.jsx";

export const settingsRouter = createHashRouter([
  {
    path: "/",
    element: <Settings />,
    children: [
      { index: true, element: <Navigate to="/general" replace /> },
      { path: "general", element: <GeneralPage /> },
      { path: "info", element: <InfoPage /> },
    ],
  },
]);
