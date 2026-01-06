const SettingToggle = ({ label }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <span className="text-lg">{label}</span>
      <div className="relative w-14 h-8 bg-sl-blue rounded-full cursor-pointer">
        <div className="absolute right-1 top-1 w-6 h-6 bg-sl-white rounded-full"></div>
      </div>
    </div>
  );
};

export default SettingToggle;
