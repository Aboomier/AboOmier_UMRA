import React from 'react';
import ProgramCard from './ProgramCard';

// قسم شهري: "برامج العمرة — أكتوبر 2026" مثلاً
export default function MonthSection({ group, onOpen }) {
  return (
    <div className="px-4 mt-5">
      <h2 className="font-bold text-base text-emerald-900 mb-3">
        برامج {group.type} — {group.monthLabel}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {group.items.map((p) => (
          <ProgramCard key={p.id} program={p} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
