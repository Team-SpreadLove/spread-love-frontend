import { NavLink } from "react-router";

const SettingSidebarLink = ({ label, to }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `block w-full px-8 py-4 text-left text-lg ${isActive ? "bg-sl-blue text-white" : "text-sl-black"}`
        }
      >
        {label}
      </NavLink>
    </li>
  );
};

export default SettingSidebarLink;
