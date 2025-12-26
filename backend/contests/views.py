from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
import uuid


from .models import Contest, ContestRegistration
from .serializers import ContestSerializer, ContestRegistrationSerializer


# تابع تست برای رفع 404
@api_view(['POST'])
def test_register(request, contest_id):
    """Test endpoint for registration"""
    try:
        contest = Contest.objects.get(id=contest_id)
    except Contest.DoesNotExist:
        return Response({
            'error': 'Contest not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    wallet_address = request.data.get('wallet_address', '')
    team_name = request.data.get('team_name', '')
    
    return Response({
        'success': True,
        'message': 'Test registration successful',
        'unique_code': 'TEST-' + uuid.uuid4().hex[:8].upper(),
        'registration_id': 999,
        'contest_id': contest.id,
        'contest_title': contest.title,
        'wallet_address': wallet_address,
        'team_name': team_name,
        'type': 'test',
        'note': 'This is a test endpoint'
    }, status=status.HTTP_201_CREATED)


class ContestViewSet(viewsets.ModelViewSet):
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer

    @action(detail=True, methods=['post'], url_path='register-free')
    def register_free(self, request, pk=None):
        """Free registration (no payment required)"""
        contest = self.get_object()
        
        wallet_address = request.data.get('wallet_address')
        team_name = request.data.get('team_name', '')
        email = request.data.get('email', '')

        if not wallet_address:
            return Response({
                'error': 'Wallet address is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if already registered
        existing = ContestRegistration.objects.filter(
            contest=contest,
            wallet_address=wallet_address
        ).first()

        if existing:
            return Response({
                'error': 'Already registered',
                'unique_code': str(existing.unique_code)
            }, status=status.HTTP_400_BAD_REQUEST)

        # Free registration
        registration = ContestRegistration.objects.create(
            contest=contest,
            wallet_address=wallet_address,
            team_name=team_name,
            email=email,
            transaction_hash=f"free_{uuid.uuid4().hex[:16]}",
            contract_address="",
            amount_paid=0.0,
            is_code_used=False
        )

        return Response({
            'success': True,
            'message': 'Free registration completed',
            'unique_code': str(registration.unique_code),
            'registration_id': registration.id,
            'registration_date': registration.registration_date,
            'contest_id': contest.id,
            'contest_title': contest.title,
            'type': 'free'
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='register-paid')
    def register_paid(self, request, pk=None):
        """Paid registration (requires payment via smart contract)"""
        contest = self.get_object()
        
        wallet_address = request.data.get('wallet_address')
        team_name = request.data.get('team_name', '')
        transaction_hash = request.data.get('transaction_hash', '')
        amount_paid = request.data.get('amount_paid', 0)
        contract_address = request.data.get('contract_address', '')
        email = request.data.get('email', '')

        if not wallet_address:
            return Response({
                'error': 'Wallet address is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not transaction_hash:
            return Response({
                'error': 'Transaction hash is required for paid registration'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not contract_address:
            return Response({
                'error': 'Contract address is required for paid registration'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if already registered
        existing = ContestRegistration.objects.filter(
            contest=contest,
            wallet_address=wallet_address
        ).first()

        if existing:
            return Response({
                'error': 'Already registered',
                'unique_code': str(existing.unique_code)
            }, status=status.HTTP_400_BAD_REQUEST)

        # Verify payment amount (optional)
        expected_price = float(contest.registration_price)
        paid_amount = float(amount_paid)
        
        if paid_amount < expected_price:
            return Response({
                'error': f'Insufficient payment. Expected {expected_price} ETH, got {paid_amount} ETH'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Paid registration with contract address
        registration = ContestRegistration.objects.create(
            contest=contest,
            wallet_address=wallet_address,
            team_name=team_name,
            email=email,
            transaction_hash=transaction_hash,
            contract_address=contract_address,
            amount_paid=paid_amount,
            is_code_used=False
        )

        return Response({
            'success': True,
            'message': 'Paid registration via smart contract completed',
            'unique_code': str(registration.unique_code),
            'registration_id': registration.id,
            'transaction_hash': registration.transaction_hash,
            'contract_address': registration.contract_address,
            'amount_paid': float(registration.amount_paid),
            'registration_date': registration.registration_date,
            'contest_id': contest.id,
            'contest_title': contest.title,
            'type': 'paid'
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path='registrations')
    def get_registrations(self, request, pk=None):
        """Get all registrations for this contest"""
        contest = self.get_object()
        registrations = ContestRegistration.objects.filter(contest=contest)
        serializer = ContestRegistrationSerializer(registrations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='verify-code')
    def verify_code(self, request, pk=None):
        """Verify registration code"""
        contest = self.get_object()
        unique_code = request.data.get('unique_code')

        if not unique_code:
            return Response({
                'error': 'Unique code is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            registration = ContestRegistration.objects.get(
                contest=contest,
                unique_code=unique_code
            )

            if registration.is_code_used:
                return Response({
                    'valid': False,
                    'message': 'Code already used'
                }, status=status.HTTP_400_BAD_REQUEST)

            registration.is_code_used = True
            registration.save()

            return Response({
                'valid': True,
                'message': 'Code is valid',
                'wallet_address': registration.wallet_address,
                'team_name': registration.team_name,
                'transaction_hash': registration.transaction_hash,
                'contract_address': registration.contract_address,
                'amount_paid': float(registration.amount_paid),
                'registration_type': 'free' if registration.transaction_hash.startswith('free_') else 'paid',
                'contest_id': contest.id,
                'contest_title': contest.title
            }, status=status.HTTP_200_OK)

        except ContestRegistration.DoesNotExist:
            return Response({
                'valid': False,
                'message': 'Invalid code'
            }, status=status.HTTP_404_NOT_FOUND)


class PaymentWebhookView(APIView):
    """Webhook for payment confirmations from blockchain"""
    
    def post(self, request):
        return Response({
            'status': 'webhook_ok',
            'message': 'Webhook is working'
        }, status=status.HTTP_200_OK)