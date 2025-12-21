from rest_framework import serializers
from .models import Contest, ContestRegistration


class ContestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contest
        fields = '__all__'


class ContestRegistrationSerializer(serializers.ModelSerializer):
    contest_title = serializers.CharField(source='contest.title', read_only=True)

    class Meta:
        model = ContestRegistration
        fields = ['id', 'contest', 'contest_title', 'wallet_address', 'transaction_hash',
                  'unique_code', 'is_code_used', 'registration_date', 'email']
        read_only_fields = ['unique_code', 'is_code_used', 'registration_date']


class RegistrationRequestSerializer(serializers.Serializer):
    contest_id = serializers.IntegerField()
    wallet_address = serializers.CharField(max_length=255)
    email = serializers.EmailField(required=False, allow_blank=True)


class CodeVerificationSerializer(serializers.Serializer):
    contest_id = serializers.IntegerField()
    unique_code = serializers.UUIDField()