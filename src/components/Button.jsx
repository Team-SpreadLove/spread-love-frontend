const Button = ({ children, bgColor, borderColor, textColor = "text-sl-black" }) => {
  return (
    <button
      type="button"
      className={`w-[65px] h-[30px] ${bgColor} border ${borderColor} rounded-2xl font-medium ${textColor}`}
    >
      {children}
    </button>
  );
};

export default Button;
