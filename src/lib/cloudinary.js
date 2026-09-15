// رفع الصور إلى Cloudinary (خدمة مجانية، بدون الحاجة لبطاقة بنكية أو خطة Firebase المدفوعة)
// القيم تُقرأ من .env — انظر .env.example
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImage(file, folder = 'umrah-app') {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok) {
    throw new Error('فشل رفع الصورة، تأكد من إعدادات Cloudinary في ملف .env');
  }
  const data = await res.json();
  return data.secure_url;
}
