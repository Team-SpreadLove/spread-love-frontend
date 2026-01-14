import { Outlet } from "react-router";
import SettingSidebarLink from "../components/SettingSidebarLink.jsx";
import Logo from "../components/Logo.jsx";

const Settings = () => {
  return (
    <div className="flex min-h-screen bg-sl-white text-sl-black">
      <aside className="flex flex-col w-75 border-r border-sl-gray-light">
        <div className="mt-3 p-6">
          <Logo iconSize={48} textSize={32} spacing="mt-0.5 ml-2 mb-3" />
        </div>
        <nav>
          <ul>
            <SettingSidebarLink label="일반" to="/general" />
            <SettingSidebarLink label="정보" to="/info" />
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Settings;
