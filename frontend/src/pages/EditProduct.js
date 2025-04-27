import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick'; // اضافة السلايدر
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './EditProduct.css'; // ملف التنسيق الخاص بك

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image1: null,
    image2: null,
    image3: null,
  });

  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/product/${id}/`)
      .then(res => {
        setProduct({
          name: res.data.name,
          description: res.data.description,
          category: res.data.category,
          price: res.data.price,
          image1: null,
          image2: null,
          image3: null,
        });
        setPreviewImages(res.data.images);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (files) {
      setProduct(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('category', product.category);
    formData.append('price', product.price);
    if (product.image1) formData.append('image1', product.image1);
    if (product.image2) formData.append('image2', product.image2);
    if (product.image3) formData.append('image3', product.image3);

    try {
      await axios.put(`http://localhost:8000/api/update-product/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('✅ تم التحديث بنجاح');
      navigate('/seller');
    } catch (err) {
      console.error(err);
      alert('❌ حدث خطأ أثناء التحديث');
    }
  };

  // إعدادات السلايدر
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: true, // لأنك بالعربي (يدعم الاتجاه من اليمين لليسار)
  };

  return (
    <div className="edit-product">
      <h2>تعديل المنتج</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="الاسم" required />
        </div>

        <div className="form-group">
          <textarea name="description" value={product.description} onChange={handleChange} placeholder="الوصف" required />
        </div>

        <div className="form-group">
          <input type="text" name="category" value={product.category} onChange={handleChange} placeholder="الصنف" required />
        </div>

        <div className="form-group">
          <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="السعر" required />
        </div>

        <div className="form-group">
          <label>الصورة 1:</label>
          <input type="file" name="image1" accept="image/*" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>الصورة 2:</label>
          <input type="file" name="image2" accept="image/*" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>الصورة 3:</label>
          <input type="file" name="image3" accept="image/*" onChange={handleChange} />
        </div>

        {/* سلايدر الصور */}
        {previewImages.length > 0 && (
          <div className="preview-slider">
            <Slider {...sliderSettings}>
              {previewImages.map((img, index) => (
                img ? (
                  <div key={index}>
                    <img src={img} alt={`صورة ${index + 1}`} className="slider-image" />
                  </div>
                ) : null
              ))}
            </Slider>
          </div>
        )}

        <div className="form-group">
             <button type="submit" className="save-button">💾 حفظ التغييرات</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
