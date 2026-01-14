const SettingSelect = ({ label, value, onChange, options }) => {
  return (
    <div className="mb-8">
      <label className="block mb-2 text-lg text-sl-gray-dark">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full p-3 bg-sl-white border border-sl-gray-light rounded-lg text-lg"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SettingSelect;
