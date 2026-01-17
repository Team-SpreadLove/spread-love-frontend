import SettingTabLayout from "../components/SettingTabLayout.jsx";
import SettingLink from "../components/SettingLink.jsx";

const InfoPage = () => {
  return (
    <SettingTabLayout title="정보">
      <SettingLink
        label="사용 방법"
        url="https://github.com/SpreadLoveProject/spread-love-frontend"
      />
      <SettingLink
        label="버그 제보"
        url="https://github.com/SpreadLoveProject/spread-love-frontend"
      />
      <SettingLink label="Github" url="https://github.com/SpreadLoveProject/spread-love-frontend" />
    </SettingTabLayout>
  );
};

export default InfoPage;
