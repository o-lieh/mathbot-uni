from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
import uuid


from .models import Contest, ContestRegistration
from .serializers import ContestSerializer, ContestRegistrationSerializer, RegistrationRequestSerializer, \
    CodeVerificationSerializer


class ContestViewSet(viewsets.ModelViewSet):
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer

    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        """ثبت‌نام در مسابقه و تولید کد یکتا"""
        contest = self.get_object()
        serializer = RegistrationRequestSerializer(data=request.data)

        if serializer.is_valid():
            wallet_address = serializer.validated_data['wallet_address']
            email = serializer.validated_data.get('email', '')

            # چک کردن آیا قبلاً ثبت‌نام کرده یا نه
            existing_registration = ContestRegistration.objects.filter(
                contest=contest,
                wallet_address=wallet_address
            ).first()

            if existing_registration:
                return Response({
                    'error': 'شما قبلاً در این مسابقه ثبت‌نام کرده‌اید',
                    'unique_code': str(existing_registration.unique_code)
                }, status=status.HTTP_400_BAD_REQUEST)

            # در اینجا باید منطق تأیید پرداخت از طریق متامسک انجام شود
            # برای نمونه، فرض می‌کنیم پرداخت موفقیت‌آمیز بوده

            # ایجاد ثبت‌نام جدید
            registration = ContestRegistration.objects.create(
                contest=contest,
                wallet_address=wallet_address,
                email=email,
                # در حالت واقعی، transaction_hash از متامسک دریافت می‌شود
                transaction_hash=f"tx_{uuid.uuid4().hex[:16]}"
            )

            return Response({
                'success': True,
                'message': 'ثبت‌نام با موفقیت انجام شد',
                'unique_code': str(registration.unique_code),
                'registration_id': registration.id
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def verify_code(self, request, pk=None):
        """تأیید اعتبار کد وارد شده"""
        contest = self.get_object()
        serializer = CodeVerificationSerializer(data=request.data)

        if serializer.is_valid():
            unique_code = serializer.validated_data['unique_code']

            try:
                registration = ContestRegistration.objects.get(
                    contest=contest,
                    unique_code=unique_code
                )

                if registration.is_code_used:
                    return Response({
                        'valid': False,
                        'message': 'این کد قبلاً استفاده شده است'
                    }, status=status.HTTP_400_BAD_REQUEST)

                # علامت‌گذاری کد به عنوان استفاده شده
                registration.is_code_used = True
                registration.save()

                return Response({
                    'valid': True,
                    'message': 'کد معتبر است',
                    'wallet_address': registration.wallet_address
                }, status=status.HTTP_200_OK)

            except ContestRegistration.DoesNotExist:
                return Response({
                    'valid': False,
                    'message': 'کد نامعتبر است'
                }, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentWebhookView(APIView):
    """Webhook برای دریافت تأییدیه پرداخت از متامسک"""

    def post(self, request):
        # در اینجا اطلاعات تراکنش از متامسک دریافت می‌شود
        # این بخش بستگی به نحوه پیاده‌سازی متامسک دارد
        transaction_data = request.data

        # پردازش اطلاعات تراکنش
        # ...

        return Response({'status': 'received'}, status=status.HTTP_200_OK)