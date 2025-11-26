from rest_framework import serializers
from .models import Contest


class ContestSerializer(serializers.ModelSerializer):
    available_spots = serializers.ReadOnlyField()

    class Meta:
        model = Contest
        fields = '__all__'