import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterSellerPage.css';

function RegisterSellerPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    surname: '',
    phone_number: '',
    email: '',
    address: '',
    birth_date: '',
    password: '',
    profile_picture: null,  // إضافة حقل للصورة
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, profile_picture: files[0] }); // حفظ الصورة
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    // إضافة جميع الحقول إلى FormData
    for (const key in form) {
      formData.append(key, form[key]);
    }

    fetch('/api/register-seller/', {
      method: 'POST',
      body: formData,  // إرسال FormData بدلاً من JSON
    })
      .then((res) => {
        if (!res.ok) throw new Error('فشل في التسجيل');
        return res.json();
      })
      .then((data) => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', 'seller');
        localStorage.setItem('userId', data.id);
        navigate('/seller');
      })
      .catch((err) => alert('حدث خطأ: ' + err.message));
  };

  return (
    <div className="register-container">
      <h2>تسجيل بائع جديد</h2>
      <form onSubmit={handleSubmit}>
        {['name', 'surname', 'phone_number', 'email', 'address', 'birth_date', 'password'].map((field) => (
          <input
            key={field}
            type={field === 'birth_date' ? 'date' : field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
            name={field}
            placeholder={field.replace('_', ' ')}
            value={form[field]}
            onChange={handleChange}
            required
          />
        ))}
        
        {/* حقل لتحميل الصورة */}
        <input
          type="file"
          name="profile_picture"
          onChange={handleChange}
          accept="image/*"
        />
        
        <button type="submit">تسجيل</button>
      </form>
    </div>
  );
}

export default RegisterSellerPage;
