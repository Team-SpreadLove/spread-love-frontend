import SettingTabLayout from "../components/SettingTabLayout.jsx";
import SettingSelect from "../components/SettingSelect.jsx";
import SettingLink from "../components/SettingLink.jsx";

const GeneralPage = () => {
  return (
    <SettingTabLayout title="일반">
      <SettingSelect label="요약 길이 조절">
        <option value="short">짧게</option>
        <option value="medium">중간</option>
        <option value="long">길게</option>
      </SettingSelect>
      <SettingSelect label="텍스트 페르소나">
        <option value="friendly">친근함</option>
        <option value="default">기본</option>
        <option value="professional">전문적</option>
      </SettingSelect>
      <SettingLink label="단축키 설정" />
    </SettingTabLayout>
  );
};

export default GeneralPage;
