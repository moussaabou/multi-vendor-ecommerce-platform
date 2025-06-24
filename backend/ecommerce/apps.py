from django.apps import AppConfig
from django.db.utils import OperationalError, ProgrammingError


class EcommerceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ecommerce'

    def ready(self):
        from .models import Admin
        try:
            # تحقق إذا كان الإدمن موجود مسبقًا
            if not Admin.objects.filter(email='admin@example.com').exists():
                Admin.objects.create(
                    name='Admin',
                    surname='Default',
                    email='admin@example.com',
                    password='admin123',  # ⚠️ الأفضل تشفيره أو تغييره بعد التشغيل
                )
        except (OperationalError, ProgrammingError):
            # يحصل هذا الخطأ عند تشغيل migrate لأول مرة أو عدم جاهزية الجدول
            pass
