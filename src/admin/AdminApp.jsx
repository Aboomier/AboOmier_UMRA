import React, { useEffect, useState } from 'react';
import { BookOpen, Building2, Image as ImageIcon, LogOut, Loader2 } from 'lucide-react';
import { onAuthChange, logoutAdmin } from '../lib/firestore';
import Login from './Login';
import ProgramsTab from './ProgramsTab';
import CompaniesTab from './CompaniesTab';
import AppearanceTab from './AppearanceTab';

export default function AdminApp() {
  const [user, setUser] = useState(undefined); // undefined = جاري التحقق، null = غير مسجل دخول
  const [tab, setTab] = useState('programs');

  useEffect(() => onAuthChange(setUser), []);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-800" size={26} />
      </div>
    );
  }
  if (!user) return <Login />;

  return (
    <div dir="rtl" className="min-h-screen bg-stone-100">
      <div className="bg-emerald-900 text-white px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold">لوحة تحكم البرامج</h1>
        <button onClick={logoutAdmin} className="flex items-center gap-1 text-xs bg-emerald-800 px-3 py-1.5 rounded-full">
          <LogOut size={13} /> خروج
        </button>
      </div>
      <div className="flex gap-2 px-4 py-3 bg-white border-b border-stone-200 overflow-x-auto">
        {[
          { id: 'programs', label: 'البرامج', icon: BookOpen },
          { id: 'companies', label: 'الشركات', icon: Building2 },
          { id: 'appearance', label: 'واجهة العميل', icon: ImageIcon },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 ' +
                (tab === t.id ? 'bg-emerald-900 text-white' : 'bg-stone-100 text-stone-500')
              }
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>
      <div className="max-w-2xl mx-auto p-4">
        {tab === 'programs' && <ProgramsTab />}
        {tab === 'companies' && <CompaniesTab />}
        {tab === 'appearance' && <AppearanceTab />}
      </div>
    </div>
  );
}
