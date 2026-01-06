const Button = ({ children, bgColor, borderColor }) => {
  return (
    <button
      type="button"
      className={`w-[65px] h-[30px] ${bgColor} border ${borderColor} rounded-2xl font-medium`}
    >
      {children}
    </button>
  );
};

export default Button;
