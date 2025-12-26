from rest_framework import serializers
from .models import Contest, ContestRegistration


class ContestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contest
        fields = '__all__'


class ContestRegistrationSerializer(serializers.ModelSerializer):
    contest_title = serializers.CharField(source='contest.title', read_only=True)
    contest_date = serializers.DateField(source='contest.date', read_only=True)
    registration_price = serializers.DecimalField(source='contest.registration_price', read_only=True, max_digits=10, decimal_places=2)
    
    class Meta:
        model = ContestRegistration
        fields = [
            'id', 'contest', 'contest_title', 'contest_date', 'registration_price',
            'wallet_address', 'team_name', 'transaction_hash', 'contract_address',
            'amount_paid', 'unique_code', 'is_code_used', 'registration_date', 'email'
        ]
        read_only_fields = ['unique_code', 'is_code_used', 'registration_date']


class FreeRegistrationSerializer(serializers.Serializer):
    wallet_address = serializers.CharField(max_length=255, required=True)
    team_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)


class PaidRegistrationSerializer(serializers.Serializer):
    wallet_address = serializers.CharField(max_length=255, required=True)
    team_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    transaction_hash = serializers.CharField(max_length=255, required=True)
    amount_paid = serializers.DecimalField(max_digits=10, decimal_places=4, required=True)
    contract_address = serializers.CharField(max_length=255, required=True)


class CodeVerificationSerializer(serializers.Serializer):
    unique_code = serializers.UUIDField(required=True)