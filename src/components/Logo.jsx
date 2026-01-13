import { Link } from "react-router";

const Logo = ({ iconSize, textSize, spacing, onClick, disableLink }) => {
  const content = (
    <>
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
    </>
  );

  return disableLink ? (
    <div onClick={onClick} className="flex cursor-default">
      {content}
    </div>
  ) : (
    <Link to="/" onClick={onClick} className="flex">
      {content}
    </Link>
  );
};

export default Logo;
