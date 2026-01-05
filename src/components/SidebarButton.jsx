const SidebarButton = ({ label, className }) => {
  return <button className={`w-full text-left px-8 py-4 text-lg ${className}`}>{label}</button>;
};

export default SidebarButton;
