import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { subscribePrograms, subscribeSettings } from '../lib/firestore';
import { groupByTypeAndMonth } from '../lib/dateUtils';
import CoverHeader from './components/CoverHeader';
import SidebarBanner from './components/SidebarBanner';
import FeaturedStrip from './components/FeaturedStrip';
import MonthSection from './components/MonthSection';
import ProgramModal from './components/ProgramModal';

// الشاشة التي يراها العميل: لا تحتوي على اسم أي شركة إطلاقاً، فقط اسم ورقم المسوّق (agentName/agentPhone)
export default function ClientApp() {
  const [programs, setPrograms] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('الكل');
  const [active, setActive] = useState(null);

  useEffect(() => {
    const unsub1 = subscribePrograms((data) => {
      setPrograms(data);
      setLoading(false);
    });
    const unsub2 = subscribeSettings(setSettings);
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const featured = programs.filter((p) => p.featured);

  const filtered = programs.filter((p) => {
    const matchesType = typeFilter === 'الكل' || p.type === typeFilter;
    const matchesSearch = !search.trim() || p.title.includes(search.trim());
    return matchesType && matchesSearch;
  });

  const groups = useMemo(() => groupByTypeAndMonth(filtered), [filtered]);

  return (
    <div dir="rtl" className="min-h-screen bg-stone-100 text-stone-900">
      <CoverHeader settings={settings} />

      <div className="max-w-5xl mx-auto md:flex md:gap-4 md:px-4">
        <div className="flex-1">
          <div className="px-4 pt-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن برنامج"
                className="w-full bg-white border border-stone-200 rounded-xl py-2.5 pr-9 pl-3 text-sm outline-none"
              />
            </div>
            <div className="flex gap-2 mt-3">
              {['الكل', 'عمرة', 'حج'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={
                    'px-3 py-1.5 rounded-full text-xs font-bold border ' +
                    (typeFilter === t
                      ? 'bg-emerald-900 text-white border-emerald-900'
                      : 'bg-white text-stone-600 border-stone-200')
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <FeaturedStrip programs={featured} onOpen={setActive} />

          {loading ? (
            <p className="text-center text-stone-400 text-sm mt-10">جاري تحميل البرامج...</p>
          ) : groups.length === 0 ? (
            <p className="text-center text-stone-400 text-sm mt-10">لا توجد برامج متاحة حالياً</p>
          ) : (
            groups.map((g) => (
              <MonthSection key={g.type + g.monthKey} group={g} onOpen={setActive} />
            ))
          )}

          <div className="h-10" />
        </div>

        {settings?.sidebarBannerUrl && (
          <div className="px-4 md:px-0 pb-6">
            <SidebarBanner url={settings.sidebarBannerUrl} />
          </div>
        )}
      </div>

      <ProgramModal program={active} settings={settings} onClose={() => setActive(null)} />
    </div>
  );
}
