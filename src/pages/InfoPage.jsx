import SettingLink from "../components/SettingLink.jsx";

const InfoPage = () => {
  return (
    <div className="pl-4 pt-4">
      <h1 className="mb-16 text-3xl font-bold">정보</h1>
      <div className="max-w-md">
        <SettingLink label="사용 방법" />
        <SettingLink label="버그 제보" />
        <SettingLink label="Github" />
      </div>
    </div>
  );
};

export default InfoPage;
