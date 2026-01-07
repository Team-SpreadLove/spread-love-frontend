import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex flex-col h-screen gap-5 p-5">
      <Header />
      <main className="flex flex-col items-center justify-center gap-2 w-full h-full p-3 border border-sl-blue rounded-xl">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
