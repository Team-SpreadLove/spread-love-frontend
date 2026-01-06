import SettingTabLayout from "../components/SettingTabLayout.jsx";
import SettingToggle from "../components/SettingToggle.jsx";

const AccessibilityPage = () => {
  return (
    <SettingTabLayout title="저시력자 모드">
      <SettingToggle label="테마" />
      <SettingToggle label="하이라이팅" />
    </SettingTabLayout>
  );
};

export default AccessibilityPage;
