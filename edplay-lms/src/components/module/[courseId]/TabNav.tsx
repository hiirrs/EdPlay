'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const router = useRouter();
  const params = useParams();
  const courseIdRaw = params?.courseId;
  const courseId = Array.isArray(courseIdRaw)
    ? courseIdRaw[0]
    : courseIdRaw;

  const [activeIndex, setActiveIndex] = useState(0); // default index safe

  useEffect(() => {
    setActiveIndex(tabs.indexOf(activeTab));
  }, [activeTab, tabs]);

  const colors = ['#18D169', '#00A6FF', '#FAB83D', '#EB3957'];

  // ✅ Let render happen regardless; only skip courseId-based actions
  return (
    <div className="relative border-black bg-gray-300 rounded-2xl overflow-hidden shadow-md w-full">
      <div className="relative w-full">
        <div className="flex justify-center w-full relative">
          {/* Background highlight */}
          <div
            className="absolute top-0 left-0 h-full rounded-2xl transition-all duration-300"
            style={{
              width: `${100 / tabs.length}%`,
              transform: `translateX(${activeIndex * 100}%)`,
              backgroundColor: colors[activeIndex % colors.length],
            }}
          ></div>

          {/* Tab buttons */}
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`relative flex-1 py-2 px-2 sm:py-3 sm:px-4 md:px-6 text-center font-medium transition-colors z-10 whitespace-nowrap 
                text-xs sm:text-sm md:text-base
                ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              onClick={() => {
                onTabChange(tab);
                if (courseId) {
                  const search = new URLSearchParams();
                  search.set('tab', tab);
                  router.replace(`/course/${courseId}?${search.toString()}`);
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
