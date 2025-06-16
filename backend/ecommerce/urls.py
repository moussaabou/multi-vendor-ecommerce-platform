from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    delete_product,
    delete_product_image,
    filtered_products,
    get_product_detail,
    get_seller_products,
    product_list,
    login_view,
    register_seller,
    seller_products,
    add_product,
    get_all_sellers,
    delete_seller,
    seller_profile,
    update_product,
    update_seller_profile
)

urlpatterns = [
  # ==== المنتجات ====
path('api/products/', product_list, name='product-list'),
path('api/product/<int:product_id>/', get_product_detail, name='get_product_detail'),
path('api/add-product/', add_product, name='add-product'),
path('api/update-product/<int:product_id>/', update_product, name='update_product'),
path('api/delete-product/<int:product_id>/', delete_product, name='delete_product'),
path('api/delete-product-image/<int:product_id>/<int:image_number>/', delete_product_image),
path('api/filter-products/', filtered_products, name='filtered_products'),

# ==== البائعين ====
path('api/register-seller/', register_seller, name='register-seller'),
path('api/seller-products/<int:seller_id>/', seller_products, name='seller-products'),
path('api/seller-profile/<int:seller_id>/', seller_profile, name='seller-profile'),
path('api/get-seller-products/<int:seller_id>/', get_seller_products, name='get-seller-products'),
path('api/seller-profile/<int:seller_id>/', update_seller_profile, name='update_seller_profile'),

# ==== الإدارة (أدمن) ====
path('api/sellers/', get_all_sellers, name='get-all-sellers'),
path('api/sellers/<int:seller_id>/', delete_seller, name='delete-seller'),

# ==== المصادقة ====
path('api/login/', login_view, name='login'),  # تسجيل دخول مخصص
path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT
path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# إعدادات عرض الصور أثناء التطوير
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
