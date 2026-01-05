const Logo = ({ iconSize, textSize, spacing }) => {
  return (
    <a href="/" className="flex">
      <img
        src={`/images/icons/spreadlove-icon-${iconSize}.png`}
        alt="스프레드 러브"
        width={iconSize}
        height={iconSize}
      />
      <span aria-hidden="true" className={`${spacing} font-semibold text-[${textSize}]`}>
        Spread
      </span>
      <span aria-hidden="true" className={`mt-0.5 font-semibold text-[${textSize}] text-sl-red`}>
        Love
      </span>
    </a>
  );
};

export default Logo;
