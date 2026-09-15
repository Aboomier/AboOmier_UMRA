import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { subscribeSettings, updateSettings } from '../lib/firestore';
import { uploadImage } from '../lib/cloudinary';

// كل ما يخص شكل صفحة العميل: الغلاف العلوي، البانر الجانبي، والاسم/الهاتف الذي يظهر للعميل
export default function AppearanceTab() {
  const [settings, setSettings] = useState({});
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState('');
  const [saved, setSaved] = useState(false);
  const coverRef = useRef();
  const sidebarRef = useRef();

  useEffect(() => subscribeSettings((s) => { setSettings(s); setForm(s); }), []);

  async function handleImage(e, field, folder) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    const url = await uploadImage(file, `${folder}/${Date.now()}-${file.name}`);
    await updateSettings({ [field]: url });
    setUploading('');
  }

  async function saveText() {
    await updateSettings({
      agentName: form.agentName || '',
      agentPhone: form.agentPhone || '',
      tagline: form.tagline || '',
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-xs font-bold text-stone-500 mb-1.5">
          صورة الغلاف (تظهر أعلى صفحة العميل، بنفس فكرة غلاف فيسبوك)
        </label>
        {settings.coverImageUrl && (
          <img src={settings.coverImageUrl} className="w-full h-32 object-cover rounded-xl mb-2" alt="" />
        )}
        <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, 'coverImageUrl', 'covers')} />
        <button onClick={() => coverRef.current.click()} className="bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2">
          {uploading === 'coverImageUrl' && <Loader2 className="animate-spin" size={14} />} تغيير صورة الغلاف
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-500 mb-1.5">
          بانر جانبي (إعلان يظهر في جانب الصفحة)
        </label>
        {settings.sidebarBannerUrl && (
          <img src={settings.sidebarBannerUrl} className="w-40 rounded-xl mb-2" alt="" />
        )}
        <input ref={sidebarRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, 'sidebarBannerUrl', 'banners')} />
        <button onClick={() => sidebarRef.current.click()} className="bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2">
          {uploading === 'sidebarBannerUrl' && <Loader2 className="animate-spin" size={14} />} تغيير البانر الجانبي
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col gap-3">
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1.5">عنوان الصفحة</label>
          <input
            value={form.tagline || ''}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full border border-stone-200 rounded-xl py-2.5 px-3 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1.5">اسمك (يظهر للعميل بدل اسم الشركة)</label>
          <input
            value={form.agentName || ''}
            onChange={(e) => setForm({ ...form, agentName: e.target.value })}
            className="w-full border border-stone-200 rounded-xl py-2.5 px-3 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1.5">رقم التواصل (للاتصال والواتساب)</label>
          <input
            value={form.agentPhone || ''}
            onChange={(e) => setForm({ ...form, agentPhone: e.target.value })}
            dir="ltr"
            placeholder="9665xxxxxxxx"
            className="w-full border border-stone-200 rounded-xl py-2.5 px-3 text-sm"
          />
        </div>
        <button onClick={saveText} className="bg-emerald-900 text-white rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2">
          {saved && <Check size={15} />} {saved ? 'تم الحفظ' : 'حفظ'}
        </button>
      </div>
    </div>
  );
}
