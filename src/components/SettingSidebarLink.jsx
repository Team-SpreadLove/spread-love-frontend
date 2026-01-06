const SettingSidebarLink = ({ label, href = "#" }) => {
  return (
    <li>
      <a href={href} className="block w-full px-8 py-4 text-left text-lg text-sl-black">
        {label}
      </a>
    </li>
  );
};

export default SettingSidebarLink;
