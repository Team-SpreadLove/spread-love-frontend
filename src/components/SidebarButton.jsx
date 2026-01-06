const SidebarButton = ({ label, className }) => {
  return <button className={`w-full px-8 py-4 text-left text-lg ${className}`}>{label}</button>;
};

export default SidebarButton;
