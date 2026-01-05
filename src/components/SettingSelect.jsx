const SettingSelect = ({ label, value }) => {
  return (
    <div className="mb-8">
      <label className="block text-gray-600 text-lg mb-2">{label}</label>
      <div className="relative">
        <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-lg">
          <option>{value}</option>
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></span>
      </div>
    </div>
  );
};

export default SettingSelect;
