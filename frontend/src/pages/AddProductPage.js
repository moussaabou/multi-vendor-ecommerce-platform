import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AddProductPage.css';

function AddProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const sellerId = localStorage.getItem('userId');

  const handleImageChange = (index, file) => {
    if (index === 0) {
      setImage1(file);
    } else if (index === 1) {
      setImage2(file);
    } else if (index === 2) {
      setImage3(file);
    }

    const previewUrl = file ? URL.createObjectURL(file) : null;
    setImagePreviews((prev) => {
      const updated = [...prev];
      updated[index] = previewUrl;
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(price) || price <= 0) {
      alert('الرجاء إدخال سعر صالح');
      return;
    }

    if (!sellerId) {
      alert('لم يتم العثور على البائع');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('seller_id', sellerId);
    if (image1) formData.append('image1', image1);
    if (image2) formData.append('image2', image2);
    if (image3) formData.append('image3', image3);

    fetch('/api/add-product/', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        alert(data.message || 'تمت الإضافة');
        navigate('/seller');
      })
      .catch((err) => {
        setLoading(false);
        alert('حدث خطأ أثناء الإضافة');
        console.error(err);
      });
  };

  return (
    <div className="App">
      <Navbar />
      <div className="form-container">
        <h2>إضافة منتج جديد</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="اسم المنتج" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="text" placeholder="الفئة" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <input type="number" placeholder="السعر" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <textarea placeholder="الوصف" value={description} onChange={(e) => setDescription(e.target.value)} required />

          {/* رفع 3 صور بشكل منفصل */}
          <label>الصورة الأولى</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageChange(0, e.target.files[0])} />
          {imagePreviews[0] && <img src={imagePreviews[0]} alt="preview-1" width="100" height="100" />}

          <label>الصورة الثانية</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageChange(1, e.target.files[0])} />
          {imagePreviews[1] && <img src={imagePreviews[1]} alt="preview-2" width="100" height="100" />}

          <label>الصورة الثالثة</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageChange(2, e.target.files[0])} />
          {imagePreviews[2] && <img src={imagePreviews[2]} alt="preview-3" width="100" height="100" />}

          <button type="submit" disabled={loading}>
            {loading ? 'جاري إضافة المنتج...' : 'إضافة المنتج'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductPage;
