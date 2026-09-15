import React, { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Star, Loader2, Image as ImgIcon, AlertCircle } from 'lucide-react';
import {
  subscribePrograms, subscribeCompanies, addProgram, updateProgram,
  deleteProgram,
} from '../lib/firestore';
import { uploadImage } from '../lib/cloudinary';
import { compressImage } from '../lib/image';
import { monthLabel } from '../lib/dateUtils';

const emptyForm = {
  title: '', type: 'عمرة', category: 'عمرة', companyId: '', companyName: '',
  price: '', duration: '', startDate: '', notes: '',
  features: [], posterUrl: '', featured: false,
};
//   const emptyForm = {
//   title: '', type: 'عمرة', companyId: '', companyName: '',
//   price: '', duration: '', startDate: '', notes: '',
//   features: [], posterUrl: '', featured: false,
// }; 

export default function ProgramsTab() {
  const [programs, setPrograms] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [featureDraft, setFeatureDraft] = useState('');
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef();

  useEffect(() => subscribePrograms(setPrograms), []);
  useEffect(() => subscribeCompanies(setCompanies), []);

  function openNew() {
    setForm(emptyForm);
    setEditing('new');
  }
  function openEdit(p) {
    setForm({ ...emptyForm, ...p });
    setEditing(p.id);
  }
  function pickCompany(companyId) {
    const c = companies.find((x) => x.id === companyId);
    setForm((f) => ({
      ...f,
      companyId,
      companyName: c?.name || '',
      features: f.features.length ? f.features : (c?.features || []),
    }));
  }
  function addFeature() {
    if (!featureDraft.trim()) return;
    setForm((f) => ({ ...f, features: [...f.features, featureDraft.trim()] }));
    setFeatureDraft('');
  }
  function removeFeature(idx) {
    setForm((f) => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));
  }
  async function handlePoster(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const url = await uploadImage(compressed, `posters/${Date.now()}-${compressed.name}`);
      setForm((f) => ({ ...f, posterUrl: url }));
    } catch (err) {
      setError(err?.message || 'حدث خطأ غير متوقع أثناء رفع الصورة');
    }
    setUploading(false);
  }

    async function save() {
    setError('');
    if (!form.title.trim()) return setError('الرجاء إدخال اسم البرنامج');
    if (!form.companyId) return setError('الرجاء اختيار الشركة المنفذة');

    const data = { 
      ...form,
      category: form.category || form.type || 'عمرة',
      type: form.type || 'عمرة'
    };
    delete data.id;

    try {
      if (editing === 'new') {
        await addProgram(data);
      } else {
        await updateProgram(editing, data);
      }
      setEditing(null);
      setForm(emptyForm);
    } catch (err) {
      setError(err?.message || 'حدث خطأ غير متوقع أثناء الحفظ');
    }
  }

  // async function save() {
  //   setError('');
  //   if (!form.title.trim()) return setError('الرجاء إدخال اسم البرنامج');
  //   if (!form.companyId) return setError('الرجاء اختيار الشركة المنفذة');
  //   const data = { ...form };
  //   delete data.id;
  //   try {
  //     if (editing === 'new') {
  //       await addProgram(data);
  //     } else {
  //       await updateProgram(editing, data);
  //     }
  //     setEditing(null);
  //   } catch (err) {
  //     setError(err?.message || 'حدث خطأ غير متوقع أثناء الحفظ');
  //   }
  // }

  if (editing) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{editing === 'new' ? 'برنامج جديد' : 'تعديل البرنامج'}</h2>
          <button onClick={() => setEditing(null)} className="text-stone-400"><X size={18} /></button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2.5 flex items-start gap-2">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span className="break-words">{error}</span>
          </div>
        )}

        <div className="flex gap-2">
          {['عمرة', 'حج'].map((t) => (
            <button
              key={t}
              onClick={() => setForm({ ...form, type: t, category: t })}
              // onClick={() => setForm({ ...form, type: t })}
              className={
                'flex-1 py-2 rounded-xl text-sm font-bold border ' +
                (form.type === t ? 'bg-emerald-900 text-white border-emerald-900' : 'bg-white text-stone-500 border-stone-200')
              }
            >
              {t}
            </button>
          ))}
        </div>

        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="اسم البرنامج"
          className="border border-stone-200 rounded-xl py-2.5 px-3 text-sm"
        />

        <select
          value={form.companyId}
          onChange={(e) => pickCompany(e.target.value)}
          className="border border-stone-200 rounded-xl py-2.5 px-3 text-sm"
        >
          <option value="">اختر الشركة المنفذة (لن تظهر للعميل)</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <div className="grid grid-cols-2 gap-2">
          <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="السعر" className="border border-stone-200 rounded-xl py-2.5 px-3 text-sm" />
          <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="المدة" className="border border-stone-200 rounded-xl py-2.5 px-3 text-sm" />
        </div>

        <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="border border-stone-200 rounded-xl py-2.5 px-3 text-sm" />

        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="تفاصيل إضافية" rows={3} className="border border-stone-200 rounded-xl py-2.5 px-3 text-sm" />

        <div>
          <p className="text-xs font-bold text-stone-500 mb-1.5">مميزات البرنامج (تظهر للعميل)</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {form.features.map((f, i) => (
              <span key={i} className="flex items-center gap-1 bg-stone-100 text-xs px-2 py-1 rounded-full">
                {f}<button onClick={() => removeFeature(i)}><X size={11} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={featureDraft}
              onChange={(e) => setFeatureDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addFeature()}
              placeholder="أضف ميزة"
              className="flex-1 border border-stone-200 rounded-lg py-1.5 px-2 text-xs"
            />
            <button onClick={addFeature} className="text-emerald-800"><Check size={16} /></button>
          </div>
        </div>

        <div>
          {form.posterUrl ? (
            <div className="relative">
              <img src={form.posterUrl} className="w-full h-36 object-cover rounded-xl" alt="" />
              <button onClick={() => setForm({ ...form, posterUrl: '' })} className="absolute top-2 left-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center">
                <X size={13} />
              </button>
            </div>
          ) : (
            <button onClick={() => fileRef.current.click()} disabled={uploading} className="w-full h-28 border border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center text-stone-400">
              {uploading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  <ImgIcon size={18} />
                  <span className="text-xs mt-1">إضافة صورة/بوستر</span>
                </>
              )}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePoster} />
        </div>

        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          <Star size={14} className="text-amber-600" /> عرض مميز في أعلى الصفحة
        </label>

        <button onClick={save} className="bg-emerald-900 text-white rounded-xl py-3 text-sm font-bold">حفظ</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2.5 flex items-start gap-2">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span className="break-words">{error}</span>
        </div>
      )}
      <button onClick={openNew} className="self-start flex items-center gap-1.5 bg-emerald-900 text-white rounded-xl px-4 py-2 text-sm font-bold">
        <Plus size={15} /> برنامج جديد
      </button>
      {programs.length === 0 && <p className="text-sm text-stone-400 mt-4">لا توجد برامج بعد</p>}
      {programs.map((p) => (
        <div key={p.id} className="bg-white border border-stone-200 rounded-2xl p-3 flex items-center gap-3">
          <div className="h-14 w-14 rounded-xl bg-stone-100 overflow-hidden shrink-0">
            {p.posterUrl && <img src={p.posterUrl} className="h-full w-full object-cover" alt="" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate flex items-center gap-1.5">
              {p.featured && <Star size={12} className="text-amber-600" />} {p.title}
            </p>
            <p className="text-xs text-stone-400">{p.companyName} · {monthLabel(p.startDate)}</p>
          </div>
          <button onClick={() => openEdit(p)} className="text-stone-400"><Pencil size={15} /></button>
          {confirmDelete === p.id ? (
            <button onClick={() => { deleteProgram(p.id); setConfirmDelete(null); }} className="text-xs font-bold text-red-600">حذف؟</button>
          ) : (
            <button onClick={() => setConfirmDelete(p.id)} className="text-stone-400"><Trash2 size={15} /></button>
          )}
        </div>
      ))}
    </div>
  );
}
