import React from 'react';
import { X, Phone, MessageCircle, Clock, Tag } from 'lucide-react';
import { daysUntil } from '../../lib/dateUtils';

export default function ProgramModal({ program, settings, onClose }) {
  if (!program) return null;
  const d = daysUntil(program.startDate);
  const phoneDigits = settings?.agentPhone?.replace(/[^0-9+]/g, '');

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {program.posterUrl && (
            <img src={program.posterUrl} alt="" className="w-full h-56 object-cover" />
          )}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold">{program.title}</h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
            <span>{program.type}</span>
            {program.duration && <span>· {program.duration}</span>}
            {d !== null && d >= 0 && (
              <span className="flex items-center gap-1 text-red-600 font-bold">
                <Clock size={11} /> متبقي {d} يوم
              </span>
            )}
          </div>
          {program.price && <p className="text-lg font-bold text-amber-700 mt-2">{program.price}</p>}
          {program.features?.length > 0 && (
            <ul className="flex flex-col gap-1.5 mt-3">
              {program.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-stone-700">
                  <Tag size={13} className="text-emerald-700" /> {f}
                </li>
              ))}
            </ul>
          )}
          {program.notes && (
            <p className="text-sm text-stone-600 leading-relaxed mt-3 whitespace-pre-wrap">
              {program.notes}
            </p>
          )}

          <div className="flex gap-2 mt-5">
            {settings?.agentPhone && (
              <>
                <a
                  href={`tel:${settings.agentPhone}`}
                  className="flex-1 bg-emerald-900 text-white rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-1.5"
                >
                  <Phone size={14} /> اتصال
                </a>
                <a
                  href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(
                    'مرحباً، أرغب بالاستفسار عن: ' + program.title
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-green-600 text-white rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={14} /> واتساب
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
