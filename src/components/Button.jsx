const Button = ({ children, bgColor, borderColor }) => {
  return (
    <button
      className={`${bgColor} border ${borderColor} w-[65px] h-[30px] rounded-2xl font-medium`}
    >
      {children}
    </button>
  );
};

export default Button;
