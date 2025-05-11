import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`/api/product/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error('فشل في تحميل بيانات المنتج');
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        setError('حدث خطأ أثناء تحميل المنتج');
        console.error(err);
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      fetch(`/api/delete-product/${id}/`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) throw new Error('فشل في حذف المنتج');
          alert('تم حذف المنتج بنجاح');
          navigate(-1);
        })
        .catch((err) => {
          alert('حدث خطأ أثناء الحذف');
          console.error(err);
        });
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>جاري التحميل...</p>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false
  };

  const validImages = product.images?.filter(img => img); // فقط الصور الصحيحة

  return (
    <div className="product-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>رجوع</button>
      
      <div className="product-detail-card">
        <div className="product-images">
          {validImages && validImages.length > 0 ? (
            validImages.length === 1 ? (
              <img src={validImages[0]} alt="product" className="single-product-image" />
            ) : (
              <Slider {...sliderSettings}>
                {validImages.map((img, i) => (
                  <div key={i}>
                    <img src={img} alt={`product-${i}`} className="product-image-slide" />
                  </div>
                ))}
              </Slider>
            )
          ) : (
            <p>لا توجد صور لهذا المنتج</p>
          )}
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="price">{product.price} د.ج</p>
          <p><strong>الفئة:</strong> {product.category}</p>
          <p><strong>الوصف:</strong> {product.description}</p>
          <p>
              <strong>البائع:</strong>{' '}
           <span 
    className="seller-link" 
    onClick={() => navigate(`/seller-products/${product.seller_id}`)}
    style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
  >
    {product.seller}
  </span>
</p>

          {userType === 'seller' && product.seller_id === parseInt(userId) && (
            <div className="actions">
              <button className="edit-btn" onClick={() => navigate(`/edit-product/${product.id}`)}>تعديل</button>
              <button className="delete-btn" onClick={handleDelete}>حذف</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
