import React, { useEffect, useState } from 'react';
import './SellerProfilePage.css';

function SellerProfile() {
  const sellerId = localStorage.getItem('userId');
  const [sellerData, setSellerData] = useState({
    name: '',
    surname: '',
    phone_number: '',
    email: '',
    address: '',
    birth_date: '',
    profile_picture: '',
    current_password: '',
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/seller-profile/${sellerId}/`)
      .then(res => res.json())
      .then(data => {
        setSellerData(prev => ({ ...prev, ...data }));
        if (data.profile_picture) {
          setPreview(data.profile_picture);
        }
      })
      .catch(err => {
        console.error('فشل في تحميل البيانات', err);
        setMessage('حدث خطأ أثناء تحميل البيانات');
      });
  }, [sellerId]);

  const handleChange = (e) => {
    setSellerData({ ...sellerData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!sellerData.current_password) {
      setMessage('يرجى إدخال كلمة المرور الحالية');
      return;
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      setMessage('كلمة المرور الجديدة غير متطابقة');
      return;
    }

    const formData = new FormData();
    Object.keys(sellerData).forEach(key => {
      formData.append(key, sellerData[key]);
    });

    if (selectedImage) formData.append('profile_picture', selectedImage);
    if (newPassword) formData.append('new_password', newPassword);

    fetch(`/api/seller-profile/${sellerId}/`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage(data.message || 'تم التحديث بنجاح');
        }
      })
      .catch(err => {
        console.error('فشل في التحديث', err);
        setMessage('حدث خطأ أثناء التحديث');
      });
  };

  return (
    <div className="seller-profile-container">
      <h2>الملف الشخصي للبائع</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-image">
          {preview && <img src={preview} alt="صورة البائع" />}
          <input type="file" onChange={handleImageChange} accept="image/*" />
        </div>

        <input type="text" name="name" value={sellerData.name} onChange={handleChange} placeholder="الاسم" required />
        <input type="text" name="surname" value={sellerData.surname} onChange={handleChange} placeholder="اللقب" required />
        <input type="text" name="phone_number" value={sellerData.phone_number} onChange={handleChange} placeholder="رقم الهاتف" required />
        <input type="email" name="email" value={sellerData.email} onChange={handleChange} placeholder="الإيميل" required />
        <input type="text" name="address" value={sellerData.address} onChange={handleChange} placeholder="العنوان" />
        <input type="date" name="birth_date" value={sellerData.birth_date} onChange={handleChange} />

        <hr />

        <input
          type="password"
          name="current_password"
          value={sellerData.current_password}
          onChange={handleChange}
          placeholder="كلمة المرور الحالية (إلزامية)"
          required
        />

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="كلمة مرور جديدة (اختياري)"
        />

        <input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="تأكيد كلمة المرور الجديدة"
        />

        <button type="submit">تحديث المعلومات</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default SellerProfile;
