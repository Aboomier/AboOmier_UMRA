import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../lib/firestore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(email, password);
    } catch (err) {
      setError('بيانات الدخول غير صحيحة');
    }
    setLoading(false);
  }

  return (
    <div dir="rtl" className="min-h-screen bg-emerald-900 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 w-full max-w-sm">
        <h1 className="font-bold text-lg text-emerald-900 mb-1">لوحة تحكم البرامج</h1>
        <p className="text-xs text-stone-400 mb-4">هذه الشاشة خاصة بك فقط، ولا يصل إليها العميل</p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="البريد الإلكتروني"
          dir="ltr"
          className="w-full border border-stone-200 rounded-xl py-2.5 px-3 text-sm mb-3"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="كلمة المرور"
          dir="ltr"
          className="w-full border border-stone-200 rounded-xl py-2.5 px-3 text-sm mb-3"
        />
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1 mb-3">
            <AlertCircle size={13} /> {error}
          </p>
        )}
        <button
          disabled={loading}
          className="w-full bg-emerald-900 text-white rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2"
        >
          <LogIn size={15} /> {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
      </form>
    </div>
  );
}
