const SettingToggle = ({ label }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-lg">{label}</span>
      <div className="w-14 h-8 bg-sl-blue rounded-full relative cursor-pointer">
        <div className="w-6 h-6 bg-white rounded-full absolute right-1 top-1"></div>
      </div>
    </div>
  );
};

export default SettingToggle;
