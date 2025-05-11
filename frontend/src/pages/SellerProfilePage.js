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
  });
  
  const [newPassword, setNewPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/seller-profile/${sellerId}/`)
      .then(res => res.json())
      .then(data => {
        setSellerData(data);
        console.log('بيانات البائع:', data);
        if (data.profile_picture) {
          setPreview(data.profile_picture);
        }
      })
      .catch(err => console.error('فشل في تحميل البيانات', err));
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

    const formData = new FormData();
    Object.keys(sellerData).forEach(key => {
      formData.append(key, sellerData[key]);
    });
    if (selectedImage) formData.append('profile_picture', selectedImage);
    if (newPassword) formData.append('password', newPassword);

    fetch(`/api/seller-profile/${sellerId}/`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message || 'تم التحديث');
      })
      .catch(err => {
        setMessage('حدث خطأ أثناء التحديث');
        console.error(err);
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

        <input type="text" name="name" value={sellerData.name} onChange={handleChange} placeholder="الاسم" />
        <input type="text" name="surname" value={sellerData.surname} onChange={handleChange} placeholder="اللقب" />
        <input type="text" name="phone_number" value={sellerData.phone_number} onChange={handleChange} placeholder="رقم الهاتف" />
        <input type="text" name="address" value={sellerData.address} onChange={handleChange} placeholder="العنوان" />
        <input type="date" name="birth_date" value={sellerData.birth_date} onChange={handleChange} />

        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="كلمة مرور جديدة (اختياري)" />

        <button type="submit">تحديث المعلومات</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default SellerProfile;
