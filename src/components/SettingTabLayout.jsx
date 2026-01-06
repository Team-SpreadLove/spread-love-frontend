const SettingTabLayout = ({ title, children }) => {
  return (
    <div className="pl-4 pt-4">
      <h1 className="mb-16 text-3xl font-bold">{title}</h1>
      <div className="max-w-md">{children}</div>
    </div>
  );
};

export default SettingTabLayout;
