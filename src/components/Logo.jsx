const Logo = ({ iconSize, textSize, spacing }) => {
  return (
    <a href="/" className="flex">
      <img
        src={`/images/icons/spreadlove-icon-${iconSize}.png`}
        alt="SpreadLove"
        width={iconSize}
        height={iconSize}
      />
      <span className={`${spacing} font-semibold text-[${textSize}]`}>Spread</span>
      <span className={`mt-0.5 font-semibold text-[${textSize}] text-sl-red`}>Love</span>
    </a>
  );
};

export default Logo;
