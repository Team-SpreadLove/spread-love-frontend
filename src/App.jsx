import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SummaryPage from "./pages/SummaryPage";
import HistoryPage from "./pages/HistoryPage";

const App = () => {
  return (
    <div className="flex flex-col h-screen gap-5 p-5">
      <Header />
      <main className="flex flex-col items-center justify-center gap-2 w-full h-full p-3 border border-sl-blue rounded-xl">
        <Routes>
          <Route path="/" element={<SummaryPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
