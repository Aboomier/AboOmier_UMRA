import {
  collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot,
  query, orderBy, serverTimestamp, setDoc,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from 'firebase/auth';
import { db, auth } from '../firebase';

// ---------- البرامج ----------
export function subscribePrograms(cb) {
  const q = query(collection(db, 'programs'), orderBy('startDate', 'asc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}
export function addProgram(data) {
  return addDoc(collection(db, 'programs'), { ...data, createdAt: serverTimestamp() });
}
export function updateProgram(id, data) {
  return updateDoc(doc(db, 'programs', id), data);
}
export function deleteProgram(id) {
  return deleteDoc(doc(db, 'programs', id));
}

// ---------- الشركات ----------
export function subscribeCompanies(cb) {
  return onSnapshot(collection(db, 'companies'), (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}
export function addCompany(data) {
  return addDoc(collection(db, 'companies'), data);
}
export function updateCompany(id, data) {
  return updateDoc(doc(db, 'companies', id), data);
}
export function deleteCompany(id) {
  return deleteDoc(doc(db, 'companies', id));
}

// ---------- إعدادات الواجهة (الغلاف / البانر / بيانات التواصل) ----------
export function subscribeSettings(cb) {
  return onSnapshot(doc(db, 'settings', 'site'), (snap) => {
    cb(snap.exists() ? snap.data() : {});
  });
}
export function updateSettings(data) {
  return setDoc(doc(db, 'settings', 'site'), data, { merge: true });
}

// ---------- الدخول (لوحة التحكم فقط) ----------
export function loginAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export function logoutAdmin() {
  return signOut(auth);
}
export function onAuthChange(cb) {
  return onAuthStateChanged(auth, cb);
}
