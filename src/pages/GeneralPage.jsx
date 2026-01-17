import { useState, useEffect } from "react";
import SettingTabLayout from "../components/SettingTabLayout.jsx";
import SettingSelect from "../components/SettingSelect.jsx";
import SettingLink from "../components/SettingLink.jsx";
import { LENGTH_OPTIONS, PERSONA_OPTIONS, DEFAULT_SETTINGS } from "../constants/index.js";

const GeneralPage = () => {
  const [length, setLength] = useState(DEFAULT_SETTINGS.length);
  const [persona, setPersona] = useState(DEFAULT_SETTINGS.persona);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    chrome.storage.sync.get("settings", (result) => {
      if (!isMounted) return;

      if (result.settings) {
        setLength(result.settings.length || DEFAULT_SETTINGS.length);
        setPersona(result.settings.persona || DEFAULT_SETTINGS.persona);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLengthChange = (e) => {
    setLength(e.target.value);
    setIsSaved(false);
  };

  const handlePersonaChange = (e) => {
    setPersona(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    const settings = { length, persona };

    chrome.storage.sync.set({ settings }, () => {
      setIsSaved(true);
    });
  };

  return (
    <SettingTabLayout title="일반">
      <SettingSelect
        label="요약 길이 조절"
        value={length}
        onChange={handleLengthChange}
        options={LENGTH_OPTIONS}
      />
      <SettingSelect
        label="텍스트 페르소나"
        value={persona}
        onChange={handlePersonaChange}
        options={PERSONA_OPTIONS}
      />
      <SettingLink label="단축키 설정" />

      <button
        type="button"
        onClick={handleSave}
        className="w-full px-6 py-3 bg-sl-blue text-white rounded-lg text-lg cursor-pointer"
      >
        저장
      </button>

      {isSaved && <p className="mt-4 text-sl-gray-dark text-base">설정이 저장되었습니다.</p>}
    </SettingTabLayout>
  );
};

export default GeneralPage;
