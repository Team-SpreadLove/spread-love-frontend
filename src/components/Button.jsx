import { Link } from "react-router";

const Button = ({ children, bgColor, borderColor, textColor = "text-sl-black", to, onClick }) => {
  const className = `flex justify-center items-center w-[65px] h-[30px] ${bgColor} border ${borderColor} rounded-2xl font-medium ${textColor}`;

  return to ? (
    <Link to={to} className={className}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Button;
