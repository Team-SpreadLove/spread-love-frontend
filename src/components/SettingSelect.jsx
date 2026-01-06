const SettingSelect = ({ label, children }) => {
  return (
    <div className="mb-8">
      <label className="block mb-2 text-lg text-sl-gray-dark">{label}</label>
      <div className="relative">
        <select className="w-full p-3 bg-sl-white border border-sl-gray-light rounded-lg text-lg">
          {children}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sl-gray-light pointer-events-none"></span>
      </div>
    </div>
  );
};

export default SettingSelect;
