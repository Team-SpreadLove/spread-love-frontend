import { Link } from "react-router";

const Logo = ({ iconSize, textSize, spacing, onClick }) => {
  return (
    <Link to="/" onClick={onClick} className="flex">
      <img
        src={`/images/icons/spreadlove-icon-${iconSize}.png`}
        alt="스프레드 러브"
        width={iconSize}
        height={iconSize}
      />
      <span aria-hidden="true" className={`${spacing} font-semibold text-[${textSize}px]`}>
        Spread
      </span>
      <span aria-hidden="true" className={`mt-0.5 font-semibold text-[${textSize}px] text-sl-red`}>
        Love
      </span>
    </Link>
  );
};

export default Logo;
