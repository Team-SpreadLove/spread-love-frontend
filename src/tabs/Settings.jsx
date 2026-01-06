import SidebarButton from "../components/SidebarButton.jsx";
import GeneralPage from "../pages/GeneralPage.jsx";
import AccessibilityPage from "../pages/AccessibilityPage.jsx";
import InfoPage from "../pages/InfoPage.jsx";

const Settings = () => {
  return (
    <div className="flex min-h-screen bg-sl-white text-sl-black">
      <aside className="flex flex-col w-72 border-r border-sl-gray-light">
        <div className="flex items-center gap-3 p-8">
          <img
            src="/images/icons/spreadlove-icon-48.png"
            alt="SpreadLove 로고"
            className="w-10 h-10"
          />
          <span className="text-2xl font-bold">SpreadLove</span>
        </div>
        <nav>
          <SidebarButton label="일반" className="bg-blue-50 text-sl-blue" />
          <SidebarButton label="저시력자 모드" className="text-sl-gray-dark" />
          <SidebarButton label="정보" className="text-sl-gray-dark" />
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <GeneralPage />
      </main>
    </div>
  );
};

export default Settings;
