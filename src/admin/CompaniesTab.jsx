import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, Check } from 'lucide-react';
import { subscribeCompanies, addCompany, updateCompany, deleteCompany } from '../lib/firestore';

// الشركات ومميزاتها الداخلية — لا تُعرض أسماء الشركات للعميل أبداً،
// لكن مميزاتها تُستخدم كنقطة بداية سريعة عند إنشاء برنامج جديد
export default function CompaniesTab() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [featureDraft, setFeatureDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => subscribeCompanies(setCompanies), []);

  async function add() {
    if (!name.trim()) return;
    await addCompany({ name: name.trim(), features: [] });
    setName('');
  }
  async function addFeature(company) {
    if (!featureDraft.trim()) return;
    await updateCompany(company.id, { features: [...(company.features || []), featureDraft.trim()] });
    setFeatureDraft('');
  }
  async function removeFeature(company, idx) {
    const next = (company.features || []).filter((_, i) => i !== idx);
    await updateCompany(company.id, { features: next });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="اسم الشركة الجديدة"
          className="flex-1 bg-white border border-stone-200 rounded-xl py-2.5 px-3 text-sm"
        />
        <button onClick={add} className="bg-emerald-900 text-white rounded-xl px-4 text-sm font-bold flex items-center gap-1">
          <Plus size={14} /> إضافة
        </button>
      </div>

      {companies.length === 0 && (
        <p className="text-sm text-stone-400">أضف الشركات التي تتعامل معها لتربط بها برامجك.</p>
      )}

      {companies.map((c) => (
        <div key={c.id} className="bg-white border border-stone-200 rounded-2xl p-3">
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm">{c.name}</p>
            {confirmDelete === c.id ? (
              <button
                onClick={() => { deleteCompany(c.id); setConfirmDelete(null); }}
                className="text-xs font-bold text-red-600"
              >
                تأكيد الحذف
              </button>
            ) : (
              <button onClick={() => setConfirmDelete(c.id)} className="text-stone-400">
                <Trash2 size={15} />
              </button>
            )}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            مميزات داخلية (لا تظهر للعميل باسم الشركة) — تُستخدم كبداية جاهزة عند إنشاء برنامج جديد لهذه الشركة
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(c.features || []).map((f, i) => (
              <span key={i} className="flex items-center gap-1 bg-stone-100 text-xs px-2 py-1 rounded-full">
                {f}
                <button onClick={() => removeFeature(c, i)}><X size={11} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              value={editingId === c.id ? featureDraft : ''}
              onFocus={() => setEditingId(c.id)}
              onChange={(e) => setFeatureDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addFeature(c)}
              placeholder="إضافة ميزة (مثال: فندق 5 نجوم قريب من الحرم)"
              className="flex-1 border border-stone-200 rounded-lg py-1.5 px-2 text-xs"
            />
            <button onClick={() => addFeature(c)} className="text-emerald-800"><Check size={16} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
