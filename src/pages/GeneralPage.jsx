import SettingTabLayout from "../components/SettingTabLayout.jsx";
import SettingSelect from "../components/SettingSelect.jsx";
import SettingLink from "../components/SettingLink.jsx";

const GeneralPage = () => {
  return (
    <SettingTabLayout title="일반">
      <SettingSelect label="요약 길이 조절">
        <option value="짧게">짧게</option>
        <option value="중간">중간</option>
        <option value="길게">길게</option>
      </SettingSelect>
      <SettingSelect label="텍스트 페르소나">
        <option value="일반 모드">일반 모드</option>
        <option value="찐친 모드">찐친 모드</option>
        <option value="초등학교 선생님 모드">초등학교 선생님 모드</option>
        <option value="큐레이터 모드">큐레이터 모드</option>
      </SettingSelect>
      <SettingLink label="단축키 설정" />
    </SettingTabLayout>
  );
};

export default GeneralPage;
