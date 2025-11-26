from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContestViewSet

router = DefaultRouter()
router.register(r'contests', ContestViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('contests/featured/', ContestViewSet.as_view({'get': 'featured'}), name='featured-contests'),
]