import SettingSelect from "../components/SettingSelect.jsx";
import SettingLink from "../components/SettingLink.jsx";

const GeneralPage = () => {
  return (
    <div className="pl-4 pt-4">
      <h1 className="mb-16 text-3xl font-bold">일반</h1>
      <div className="max-w-md">
        <SettingSelect label="요약 길이 조절" value="기본" />
        <SettingSelect label="텍스트 페르소나" value="기본 모드" />
        <SettingLink label="단축키 설정" />
      </div>
    </div>
  );
};

export default GeneralPage;
