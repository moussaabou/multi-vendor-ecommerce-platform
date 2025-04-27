from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    delete_product,
    delete_product_image,
    get_product_detail,
    product_list,
    login_view,
    register_seller,
    seller_products,
    add_product,
    get_all_sellers,
    delete_seller,
    seller_profile,
    update_product
)

urlpatterns = [
    # APIs خاصة بالتعامل مع المنتجات والبائعين
    path('api/products/', product_list, name='product-list'),
    path('api/login/', login_view, name='login'),  # تسجيل الدخول، يمكن استبداله بـ TokenObtainPairView لاحقًا
    path('api/register-seller/', register_seller, name='register-seller'),
    path('api/seller-products/<int:seller_id>/', seller_products, name='seller-products'),
    path('api/add-product/', add_product, name='add-product'),
    path('api/seller-profile/<int:seller_id>/', seller_profile, name='seller-profile'),
    path('api/product/<int:product_id>/', get_product_detail, name='get_product_detail'),
    path('api/delete-product/<int:product_id>/', delete_product, name='delete_product'),
    path('api/delete-product-image/<int:product_id>/<int:image_number>/', delete_product_image),
    path('api/update-product/<int:product_id>/', update_product, name='update_product'),




    # APIs خاصة بالإدارة (الأدمن)
    path('api/sellers/', get_all_sellers, name='get-all-sellers'),  # عرض جميع البائعين
    path('api/sellers/<int:seller_id>/', delete_seller, name='delete-seller'),  # حذف بائع

    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # الحصول على التوكن
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # تحديث التوكن
]

# إعدادات عرض الصور أثناء التطوير
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
