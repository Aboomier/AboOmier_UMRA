import React from 'react';
import { Phone, User } from 'lucide-react';

// غلاف الصفحة (يشبه غلاف فيسبوك) — يُدار من لوحة التحكم > واجهة العميل
export default function CoverHeader({ settings }) {
  return (
    <div className="relative w-full h-48 md:h-64 bg-emerald-900 overflow-hidden">
      {settings?.coverImageUrl && (
        <img
          src={settings.coverImageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/25 to-transparent" />
      <div className="absolute bottom-0 right-0 left-0 p-4 md:p-6 text-white">
        <h1 className="text-xl md:text-2xl font-bold">
          {settings?.tagline || 'برامج العمرة والحج'}
        </h1>
        {(settings?.agentName || settings?.agentPhone) && (
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
            {settings?.agentName && (
              <span className="flex items-center gap-1.5">
                <User size={14} /> {settings.agentName}
              </span>
            )}
            {settings?.agentPhone && (
              <a
                href={`tel:${settings.agentPhone}`}
                className="flex items-center gap-1.5 bg-amber-600 px-3 py-1 rounded-full font-bold"
              >
                <Phone size={14} /> {settings.agentPhone}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
