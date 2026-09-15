export const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

export function monthKey(isoDate) {
  if (!isoDate) return '9999-99';
  const d = new Date(isoDate);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function monthLabel(isoDate) {
  if (!isoDate) return 'بدون تاريخ محدد';
  const d = new Date(isoDate);
  return `${ARABIC_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// عدد الأيام المتبقية حتى تاريخ الانطلاق (يُستخدم لإبراز البرامج القريبة)
export function daysUntil(isoDate) {
  if (!isoDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(isoDate);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

// تجميع البرامج حسب النوع (حج/عمرة) والشهر، مرتبة زمنياً
export function groupByTypeAndMonth(programs) {
  const sorted = [...programs].sort((a, b) =>
    (a.startDate || '9999').localeCompare(b.startDate || '9999')
  );
  const groups = {};
  for (const p of sorted) {
    const type = p.type || 'عمرة';
    const mKey = monthKey(p.startDate);
    const groupKey = `${type}__${mKey}`;
    if (!groups[groupKey]) {
      groups[groupKey] = {
        type,
        monthKey: mKey,
        monthLabel: monthLabel(p.startDate),
        items: [],
      };
    }
    groups[groupKey].items.push(p);
  }
  return Object.values(groups).sort(
    (a, b) => a.type.localeCompare(b.type) || a.monthKey.localeCompare(b.monthKey)
  );
}
