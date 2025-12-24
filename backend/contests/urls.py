from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContestViewSet, PaymentWebhookView

router = DefaultRouter()
router.register(r'contests', ContestViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('payment-webhook/', PaymentWebhookView.as_view(), name='payment-webhook'),
]