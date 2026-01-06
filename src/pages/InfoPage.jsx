import SettingTabLayout from "../components/SettingTabLayout.jsx";
import SettingLink from "../components/SettingLink.jsx";

const InfoPage = () => {
  return (
    <SettingTabLayout title="정보">
      <SettingLink label="사용 방법" />
      <SettingLink label="버그 제보" />
      <SettingLink label="Github" />
    </SettingTabLayout>
  );
};

export default InfoPage;
