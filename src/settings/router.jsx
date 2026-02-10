import { createHashRouter, Navigate } from "react-router";
import SettingsLayout from "./SettingsLayout.jsx";
import GeneralPage from "./pages/GeneralPage.jsx";
import InfoPage from "./pages/InfoPage.jsx";

export const settingsRouter = createHashRouter([
  {
    path: "/",
    element: <SettingsLayout />,
    children: [
      { index: true, element: <Navigate to="/general" replace /> },
      { path: "general", element: <GeneralPage /> },
      { path: "info", element: <InfoPage /> },
    ],
  },
]);
