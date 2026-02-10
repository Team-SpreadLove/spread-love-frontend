const Link = ({ label, url }) => {
  const handleCreateTab = () => {
    chrome.tabs.create({ url });
  };

  return (
    <button
      type="button"
      onClick={handleCreateTab}
      className="block mb-8 text-lg text-sl-blue hover:underline cursor-pointer"
    >
      {label}
    </button>
  );
};

export default Link;
