import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import { FaSave, FaSpinner, FaImage, FaTag, FaMoneyBillWave, FaAlignLeft } from 'react-icons/fa';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './EditProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/product/${id}/`);
        setProduct({
          name: response.data.name,
          description: response.data.description,
          category: response.data.category,
          price: response.data.price,
          image1: null,
          image2: null,
          image3: null,
        });
        setPreviewImages(response.data.images);
      } catch (err) {
        console.error('خطأ في جلب بيانات المنتج:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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
    setSaving(true);
    
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
      console.error('خطأ في تحديث المنتج:', err);
      alert('❌ حدث خطأ أثناء التحديث');
    } finally {
      setSaving(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: true,
  };

  if (loading) {
    return (
      <div className="edit-product">
        <div className="loading">
          <FaSpinner className="spinner" />
          جاري تحميل بيانات المنتج...
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product">
      <h2>تعديل المنتج</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>
            <FaTag style={{ marginLeft: '8px' }} />
            اسم المنتج
          </label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="أدخل اسم المنتج"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FaAlignLeft style={{ marginLeft: '8px' }} />
            وصف المنتج
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="أدخل وصف المنتج"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FaTag style={{ marginLeft: '8px' }} />
            الصنف
          </label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="أدخل صنف المنتج"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FaMoneyBillWave style={{ marginLeft: '8px' }} />
            السعر
          </label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="أدخل سعر المنتج"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FaImage style={{ marginLeft: '8px' }} />
            الصور
          </label>
          <div className="file-inputs">
            <input
              type="file"
              name="image1"
              accept="image/*"
              onChange={handleChange}
              placeholder="الصورة 1"
            />
            <input
              type="file"
              name="image2"
              accept="image/*"
              onChange={handleChange}
              placeholder="الصورة 2"
            />
            <input
              type="file"
              name="image3"
              accept="image/*"
              onChange={handleChange}
              placeholder="الصورة 3"
            />
          </div>
        </div>

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

        <button type="submit" className="save-button" disabled={saving}>
          {saving ? (
            <>
              <FaSpinner className="spinner" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <FaSave style={{ marginLeft: '8px' }} />
              حفظ التغييرات
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
