import React from 'react';
import { Flame, Clock } from 'lucide-react';
import { daysUntil } from '../../lib/dateUtils';

// شريط العروض المميزة أعلى الصفحة — للبرامج التي تم تفعيل "عرض مميز" لها من لوحة التحكم
export default function FeaturedStrip({ programs, onOpen }) {
  if (!programs.length) return null;
  return (
    <div className="px-4 pt-4">
      <h2 className="font-bold text-base flex items-center gap-1.5 mb-2 text-amber-800">
        <Flame size={16} /> عروض مميزة
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {programs.map((p) => {
          const d = daysUntil(p.startDate);
          return (
            <button
              key={p.id}
              onClick={() => onOpen(p)}
              className="relative shrink-0 w-40 rounded-2xl overflow-hidden border border-amber-200 text-right bg-white"
            >
              <div className="h-24 bg-stone-100">
                {p.posterUrl && (
                  <img src={p.posterUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-bold line-clamp-2">{p.title}</p>
                {d !== null && d >= 0 && d <= 30 && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-red-600 font-bold mt-1">
                    <Clock size={10} /> متبقي {d} يوم
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
