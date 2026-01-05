const Settings = () => {
  return (
    <div className="flex min-h-screen bg-sl-white text-sl-black">
      <aside className="w-72 border-r border-gray-200 flex flex-col">
        <div className="flex items-center gap-3 p-8">
          <img
            src="/images/icons/spreadlove-icon-48.png"
            alt="SpreadLove 로고"
            className="w-10 h-10"
          />
          <span className="text-2xl font-bold">SpreadLove</span>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <p>콘텐츠 영역</p>
      </main>
    </div>
  );
};

export default Settings;
