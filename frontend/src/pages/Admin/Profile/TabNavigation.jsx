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
    <div className="flex items-center border-b border-white/15 gap-2 pb-px overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`px-4 sm:px-5 py-3 text-sm sm:text-base font-semibold tracking-tight transition-colors cursor-pointer border-b-2 -mb-px whitespace-nowrap ${
              isActive
                ? "border-cyan-400 text-cyan-300 font-bold"
                : "border-transparent text-white/70 hover:text-white hover:border-white/30"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
