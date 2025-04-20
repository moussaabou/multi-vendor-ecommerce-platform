from django.urls import path, re_path
from ecommerce.views import FrontendAppView

urlpatterns = [
    # إضافة API Endpoints هنا
    re_path(r'^.*$', FrontendAppView.as_view()),  # لتوجيه جميع الطلبات إلى React
]
