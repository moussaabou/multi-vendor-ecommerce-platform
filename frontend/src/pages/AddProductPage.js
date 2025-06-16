import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProductPage.css';

function AddProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);
  const [images, setImages] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const sellerId = localStorage.getItem('userId');

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages[index] = file;
    newPreviews[index] = file ? URL.createObjectURL(file) : null;
    setImages(newImages);
    setImagePreviews(newPreviews);
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
    images.forEach((img, i) => img && formData.append(`image${i + 1}`, img));

    fetch('/api/add-product/', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        alert(data.message || 'تمت الإضافة بنجاح');
        navigate('/seller');
      })
      .catch((err) => {
        setLoading(false);
        alert('حدث خطأ أثناء الإضافة');
        console.error(err);
      });
  };

  return (
    <div className="add-product-page">
      <div className="form-container">
        <h2> إضافة منتج جديد</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="اسم المنتج" value={name} onChange={(e) => setName(e.target.value)} required />
          
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">اختر نوع المنتج</option>
            <option value="هاتف">هاتف</option>
            <option value="إلكترونيات">إلكترونيات</option>
            <option value="غيارات سيارات">غيارات سيارات</option>
            <option value="حاسوب">حاسوب</option>
          </select>

          <input type="number" placeholder="السعر" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <textarea placeholder="الوصف" value={description} onChange={(e) => setDescription(e.target.value)} required />

          {[0, 1, 2].map((index) => (
            <div key={index} className="image-upload">
              <label>الصورة {index + 1}</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(index, e.target.files[0])} />
              {imagePreviews[index] && <img src={imagePreviews[index]} alt={`preview-${index}`} className="preview" />}
            </div>
          ))}

          <button type="submit" disabled={loading}>
            {loading ? '⏳ جاري إضافة المنتج...' : '✅ إضافة المنتج'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductPage;
