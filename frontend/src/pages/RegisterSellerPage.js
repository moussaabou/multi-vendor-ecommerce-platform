import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaLock, FaImage } from 'react-icons/fa';
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
    profile_picture: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setForm({ ...form, profile_picture: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    fetch('/api/register-seller/', {
      method: 'POST',
      body: formData,
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

  const renderInput = (field, icon, type = 'text') => (
    <div className="input-group">
      <div className="input-icon">
        {icon}
      </div>
      <input
        type={type}
        name={field}
        placeholder={field.replace('_', ' ')}
        value={form[field]}
        onChange={handleChange}
        required
      />
    </div>
  );

  return (
    <div className="register-container">
      <h2>تسجيل بائع جديد</h2>
      <form onSubmit={handleSubmit}>
        {renderInput('name', <FaUser />)}
        {renderInput('surname', <FaUser />)}
        {renderInput('phone_number', <FaPhone />)}
        {renderInput('email', <FaEnvelope />, 'email')}
        {renderInput('address', <FaMapMarkerAlt />)}
        {renderInput('birth_date', <FaCalendarAlt />, 'date')}
        {renderInput('password', <FaLock />, 'password')}
        
        <div className="file-input-group">
          <div className="input-icon">
            <FaImage />
          </div>
          <input
            type="file"
            name="profile_picture"
            onChange={handleChange}
            accept="image/*"
            className={previewImage ? 'has-preview' : ''}
          />
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Preview" />
            </div>
          )}
        </div>
        
        <button type="submit">تسجيل</button>
      </form>
    </div>
  );
}

export default RegisterSellerPage;
