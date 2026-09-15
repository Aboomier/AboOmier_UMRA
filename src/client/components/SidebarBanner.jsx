import React from 'react';

// بانر إعلاني جانبي — يظهر بجانب المحتوى في الشاشات الكبيرة، وأسفله في الجوال
export default function SidebarBanner({ url }) {
  if (!url) return null;
  return (
    <div className="w-full md:w-56 shrink-0">
      <img
        src={url}
        alt="إعلان"
        className="w-full rounded-2xl object-cover md:sticky md:top-4"
      />
    </div>
  );
}
