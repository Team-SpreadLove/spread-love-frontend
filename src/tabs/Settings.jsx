const Settings = () => {
  return (
    <div className="flex min-h-screen bg-sl-white text-sl-black">
      <aside className="w-72 border-r border-gray-200">
        <p className="p-8">사이드바 영역</p>
      </aside>
      <main className="flex-1 p-8">
        <p>콘텐츠 영역</p>
      </main>
    </div>
  );
};

export default Settings;
