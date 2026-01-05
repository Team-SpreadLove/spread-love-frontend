const Logo = ({ iconSize, textSize, spacing }) => {
  return (
    <a href="/" className="flex">
      <img
        src={`/images/icons/spreadlove-icon-${iconSize}.png`}
        alt="SpreadLove"
        width={iconSize}
        height={iconSize}
      />
      <span className={`${spacing} text-[${textSize}] font-semibold`}>Spread</span>
      <span className={`mt-0.5 text-[${textSize}] font-semibold text-sl-red`}>Love</span>
    </a>
  );
};

export default Logo;
