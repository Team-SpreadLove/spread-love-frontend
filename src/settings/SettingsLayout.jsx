import { Outlet } from "react-router";
import SidebarLink from "./components/SidebarLink.jsx";
import Logo from "../shared/components/Logo.jsx";

const SettingsLayout = () => {
  return (
    <div className="flex min-h-screen bg-sl-white text-sl-black">
      <aside className="flex flex-col w-75 border-r border-sl-gray-light">
        <div className="mt-3 p-6">
          <Logo iconSize={48} textSize={32} spacing="mt-0.5 ml-2 mb-3" />
        </div>
        <nav>
          <ul>
            <SidebarLink label="일반" to="/general" />
            <SidebarLink label="정보" to="/info" />
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default SettingsLayout;
