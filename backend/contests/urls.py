from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContestViewSet, PaymentWebhookView, test_register

router = DefaultRouter()
router.register(r'contests', ContestViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('payment-webhook/', PaymentWebhookView.as_view(), name='payment-webhook'),
    
    # اضافه کردن endpoint دستی برای تست
    path('contests/<int:contest_id>/test-register/', test_register, name='test-register'),
]