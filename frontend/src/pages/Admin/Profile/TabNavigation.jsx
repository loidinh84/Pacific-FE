import { useLanguage } from "../../../hooks/useLanguage";

export default function TabNavigation({
  activeTab,
  onTabChange,
  isDark = true,
}) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const tabs = [
    { id: "overview", label: isEn ? "Profile Info" : "Thông tin hồ sơ" },
    { id: "activity", label: isEn ? "Activity History" : "Lịch sử thao tác" },
  ];

  return (
    <div className="inline-flex p-1.5 rounded-2xl bg-[#0c1836]/92 backdrop-blur-md border border-white/20 shadow-sm gap-1.5 overflow-x-auto scrollbar-none mb-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm sm:text-base transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black shadow-sm"
                : "text-white/90 hover:text-white hover:bg-white/10 font-bold"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
