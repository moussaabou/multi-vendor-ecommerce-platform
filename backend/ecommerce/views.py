from email.feedparser import FeedParser
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Admin, Seller, Product
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import json
from django.core.files.storage import default_storage
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
    parser_classes,  
)
from rest_framework.parsers import MultiPartParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password  # إذا استخدمت كلمات مرور مشفّرة
from django.utils.dateparse import parse_date
from django.http import JsonResponse
import traceback
from django.shortcuts import get_object_or_404




# عرض كل المنتجات
@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    data = [
        {
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'category': p.category,
            'price': str(p.price),
            'images': [
                p.image1.url if p.image1 else None,
                p.image2.url if p.image2 else None,
                p.image3.url if p.image3 else None,
            ],
            'seller': p.seller.name,
        }
        for p in products
    ]
    return JsonResponse(data, safe=False)

# تسجيل الدخول القديم (غير معتمد على JWT)
@csrf_exempt
@api_view(['POST'])
def login_view(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')

    user = None
    role = None

    try:
        admin = Admin.objects.get(email=email)
        if admin.password == password:  # استبدل بـ check_password إذا كانت مشفّرة
            user = admin
            role = 'admin'
    except Admin.DoesNotExist:
        pass

    if not user:
        try:
            seller = Seller.objects.get(email=email)
            if seller.password == password:
                user = seller
                role = 'seller'
        except Seller.DoesNotExist:
            pass

    if not user:
        return JsonResponse({'error': 'بيانات الدخول غير صحيحة'}, status=400)

    # إنشاء JWT
    refresh = RefreshToken.for_user(user)

    return JsonResponse({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'role': role,
        'id': user.id
    })

# تسجيل بائع جديد
@csrf_exempt
def register_seller(request):
    if request.method == "POST":
        try:
            # الحصول على البيانات من FormData
            name = request.POST['name']
            surname = request.POST['surname']
            phone_number = request.POST['phone_number']
            email = request.POST['email']
            address = request.POST['address']
            birth_date = request.POST['birth_date']
            password = request.POST['password']

            # التعامل مع الصورة (إذا كانت موجودة)
            profile_picture = request.FILES.get('profile_picture', None)
            if not profile_picture:
                # إذا لم يتم إرسال صورة، يمكن تعيين صورة افتراضية
                profile_picture = 'PIO.jpg'  # اسم الصورة الافتراضية

            seller = Seller.objects.create(
                name=name,
                surname=surname,
                phone_number=phone_number,
                email=email,
                address=address,
                birth_date=birth_date,
                password=password,
                profile_picture=profile_picture,  # تعيين الصورة
            )

            return JsonResponse({'type': 'seller', 'id': seller.id})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
# عرض منتجات بائع معين

@csrf_exempt  # تعطيل CSRF لهذه الدالة
def seller_products(request, seller_id):
    # جلب المنتجات الخاصة بالبائع باستخدام seller_id
    products = Product.objects.filter(seller_id=seller_id)

    # إعداد البيانات لتنسيق الـ JSON
    data = [
        {
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'category': p.category,
            'price': str(p.price),  # تحويل السعر إلى string لتجنب أي مشاكل
            'images': [
                p.image1.url if p.image1 else None,
                p.image2.url if p.image2 else None,
                p.image3.url if p.image3 else None,
            ]
        }
        for p in products
    ]

    return JsonResponse(data, safe=False)

# إضافة منتج جديد
@csrf_exempt
def add_product(request):
    if request.method == 'POST':
        try:
            name = request.POST.get('name')
            description = request.POST.get('description')
            category = request.POST.get('category')
            price = request.POST.get('price')
            seller_id = request.POST.get('seller_id')

            product = Product(
                name=name,
                description=description,
                category=category,
                price=price,
                seller_id=seller_id,
            )

            if 'image1' in request.FILES:
                product.image1 = request.FILES['image1']
            if 'image2' in request.FILES:
                product.image2 = request.FILES['image2']
            if 'image3' in request.FILES:
                product.image3 = request.FILES['image3']

            product.save()
            return JsonResponse({'message': 'تمت إضافة المنتج بنجاح'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

# عرض جميع البائعين
@api_view(['GET'])
def get_all_sellers(request):
    sellers = Seller.objects.all()
    data = [
        {
            'id': seller.id,
            'name': seller.name,
            'email': seller.email,
            'phone_number': seller.phone_number,
        }
        for seller in sellers
    ]
    return JsonResponse(data, safe=False)  # إضافة safe=False لأن البيانات عبارة عن قائمة

# ✅ حذف بائع ومنتجاته (يتطلب أدمن)
@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_seller(request, seller_id):
    try:
        Admin.objects.get(email=request.user.email)
    except Admin.DoesNotExist:
        return JsonResponse({'error': 'غير مصرح'}, status=403)

    try:
        seller = Seller.objects.get(id=seller_id)
        Product.objects.filter(seller=seller).delete()
        seller.delete()
        return JsonResponse({'message': 'تم حذف البائع ومنتجاته'}, status=200)
    except Seller.DoesNotExist:
        return JsonResponse({'error': 'البائع غير موجود'}, status=404)


@csrf_exempt
def seller_profile(request, seller_id):
    try:
        seller = Seller.objects.get(id=seller_id)
        image_url = seller.profile_picture.url if seller.profile_picture else '/media/seller_pics/OIP.jpg'
        full_url = request.build_absolute_uri(image_url)
        return JsonResponse({
            'name': seller.name,
            'profile_picture': full_url,
        })
    except Seller.DoesNotExist:
        return JsonResponse({'error': 'Seller not found'}, status=404)
    
    # في views.py

@api_view(['GET'])
def get_product_detail(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        data = {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'category': product.category,
            'price': str(product.price),
            'images': [
                product.image1.url if product.image1 else None,
                product.image2.url if product.image2 else None,
                product.image3.url if product.image3 else None,
            ],
            'seller': product.seller.name,
            'seller_id': product.seller.id,
        }
        return JsonResponse(data)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'المنتج غير موجود'}, status=404)

# views.py
@api_view(['DELETE'])
def delete_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.delete()
        return JsonResponse({'message': 'تم حذف المنتج'})
    except Product.DoesNotExist:
        return JsonResponse({'error': 'المنتج غير موجود'}, status=404)

@api_view(['PUT'])
@parser_classes([MultiPartParser]) # type: ignore
def update_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)

        # تحديث البيانات النصية
        product.name = request.data.get('name', product.name)
        product.description = request.data.get('description', product.description)
        product.price = request.data.get('price', product.price)
        product.category = request.data.get('category', product.category)

        # تحديث الصور إذا وُجدت
        if 'image1' in request.FILES:
            product.image1 = request.FILES['image1']
        if 'image2' in request.FILES:
            product.image2 = request.FILES['image2']
        if 'image3' in request.FILES:
            product.image3 = request.FILES['image3']

        product.save()

        return JsonResponse({'message': 'تم تحديث المنتج بنجاح'})

    except Product.DoesNotExist:
        return JsonResponse({'error': 'المنتج غير موجود'}, status=404)

@api_view(['POST'])
def delete_product_image(request, product_id, image_number):
    try:
        product = Product.objects.get(id=product_id)
        if image_number == 1:
            product.image1.delete(save=False)
            product.image1 = None
        elif image_number == 2:
            product.image2.delete(save=False)
            product.image2 = None
        elif image_number == 3:
            product.image3.delete(save=False)
            product.image3 = None
        else:
            return JsonResponse({'error': 'رقم الصورة غير صالح'}, status=400)

        product.save()
        return JsonResponse({'message': f'تم حذف الصورة {image_number}'})
    except Product.DoesNotExist:
        return JsonResponse({'error': 'المنتج غير موجود'}, status=404)

def get_seller_products(request, seller_id):
    # جلب بيانات البائع باستخدام seller_id
    seller = get_object_or_404(Seller, id=seller_id)

    # جلب جميع المنتجات الخاصة بالبائع
    products = Product.objects.filter(seller=seller)

    # تنسيق البيانات بشكل مناسب للـ JSON
    product_data = []
    for product in products:
        images = []
        if product.image1:
            images.append(product.image1.url)
        if product.image2:
            images.append(product.image2.url)
        if product.image3:
            images.append(product.image3.url)

        product_data.append({
            'id': product.id,
            'name': product.name,
            'price': float(product.price),  # لتحويل Decimal إلى float
            'description': product.description,
            'images': images
        })

    # تنسيق بيانات البائع
    seller_data = {
        'name': seller.name,
        'surname': seller.surname,
        'email': seller.email,
        'phone_number': seller.phone_number,
        'address': seller.address,
        'birth_date': seller.birth_date.strftime('%Y-%m-%d'),
        'profile_picture': seller.profile_picture.url if seller.profile_picture else None
    }

    # دمج بيانات البائع والمنتجات في استجابة واحدة
    response_data = {
        'seller_info': seller_data,
        'products': product_data
    }

    return JsonResponse(response_data)

#------------

@csrf_exempt
def update_seller_profile(request, seller_id):
    try:
        seller = Seller.objects.get(id=seller_id)
    except Seller.DoesNotExist:
        return JsonResponse({'error': 'البائع غير موجود'}, status=404)

    try:
        if request.method == 'GET':
            return JsonResponse({
                'name': seller.name,
                'surname': seller.surname,
                'phone_number': seller.phone_number,
                'email': seller.email,
                'address': seller.address,
                'birth_date': str(seller.birth_date),
                'profile_picture': seller.profile_picture.url if seller.profile_picture else None,
            })

        elif request.method == 'POST':
            name = request.POST.get('name', seller.name)
            surname = request.POST.get('surname', seller.surname)
            phone_number = request.POST.get('phone_number', seller.phone_number)
            email = request.POST.get('email', seller.email)
            address = request.POST.get('address', seller.address)
            birth_date = request.POST.get('birth_date', None)
            password = request.POST.get('password')

            seller.name = name
            seller.surname = surname
            seller.phone_number = phone_number
            seller.email = email
            seller.address = address

            if birth_date:
                seller.birth_date = parse_date(birth_date)

            if 'profile_picture' in request.FILES:
                seller.profile_picture = request.FILES['profile_picture']

            if password:
                seller.password = password  # يمكنك تشفيرها مستقبلاً

            seller.save()
            return JsonResponse({'message': 'تم التحديث بنجاح'})

        else:
            return JsonResponse({'error': 'الطريقة غير مدعومة'}, status=405)

    except Exception as e:
        print("خطأ:", traceback.format_exc())  # لطباعته في الكونسول
        return JsonResponse({'error': 'حدث خطأ في الخادم'}, status=500)
