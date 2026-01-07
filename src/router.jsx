import { createMemoryRouter } from "react-router";
import App from "./App";
import SummaryPage from "./pages/SummaryPage";
import HistoryPage from "./pages/HistoryPage";

export const router = createMemoryRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <SummaryPage /> },
      { path: "history", element: <HistoryPage /> },
    ],
  },
]);
