from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Contest
from .serializers import ContestSerializer


class ContestViewSet(viewsets.ModelViewSet):
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer


    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get 3 featured contests"""
        contests = Contest.objects.all()[:3]
        serializer = self.get_serializer(contests, many=True)
        return Response(serializer.data)