import React from 'react';
import { Clock, Tag } from 'lucide-react';
import { daysUntil } from '../../lib/dateUtils';

export default function ProgramCard({ program, onOpen }) {
  const d = daysUntil(program.startDate);
  const isHajj = program.type === 'حج';
  return (
    <button
      onClick={() => onOpen(program)}
      className="w-full bg-white rounded-2xl border border-stone-200 overflow-hidden text-right flex flex-col"
    >
      <div className="h-36 bg-stone-100 relative">
        {program.posterUrl && (
          <img src={program.posterUrl} alt="" className="h-full w-full object-cover" />
        )}
        <span
          className={
            'absolute top-2 right-2 text-[11px] font-bold px-2 py-0.5 rounded-full ' +
            (isHajj ? 'bg-emerald-900 text-white' : 'bg-amber-600 text-white')
          }
        >
          {program.type}
        </span>
        {d !== null && d >= 0 && d <= 21 && (
          <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
            <Clock size={10} /> متبقي {d} يوم
          </span>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col gap-1.5">
        <h3 className="font-bold text-sm text-stone-900">{program.title}</h3>
        {program.duration && <p className="text-xs text-stone-500">{program.duration}</p>}
        {program.features?.length > 0 && (
          <ul className="text-[11px] text-stone-500 flex flex-col gap-0.5 mt-1">
            {program.features.slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-center gap-1">
                <Tag size={10} className="text-emerald-700 shrink-0" /> {f}
              </li>
            ))}
          </ul>
        )}
        {program.price && <p className="text-sm font-bold text-amber-700 mt-1">{program.price}</p>}
      </div>
    </button>
  );
}
