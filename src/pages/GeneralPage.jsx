import SettingTabLayout from "../components/SettingTabLayout.jsx";
import SettingSelect from "../components/SettingSelect.jsx";
import SettingLink from "../components/SettingLink.jsx";

const GeneralPage = () => {
  return (
    <SettingTabLayout title="일반">
      <SettingSelect label="요약 길이 조절" value="기본" />
      <SettingSelect label="텍스트 페르소나" value="기본 모드" />
      <SettingLink label="단축키 설정" />
    </SettingTabLayout>
  );
};

export default GeneralPage;
