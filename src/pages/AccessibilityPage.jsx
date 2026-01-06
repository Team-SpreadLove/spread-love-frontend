import SettingToggle from "../components/SettingToggle.jsx";

const AccessibilityPage = () => {
  return (
    <div className="pl-4 pt-4">
      <h1 className="mb-16 text-3xl font-bold">저시력자 모드</h1>
      <div className="max-w-md">
        <SettingToggle label="테마" />
        <SettingToggle label="하이라이팅" />
      </div>
    </div>
  );
};

export default AccessibilityPage;
