from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Module
from .serializers import ModuleSerializer

class ModuleListView(APIView):
    def get(self, request):
        try:
            modules = Module.objects.all()
        except Module.DoesNotExist:
            return Response({"error":"module not found"},status=status.HTTP_404_NOT_FOUND)
        serializer = ModuleSerializer(modules, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class SavePathView(APIView):
    def post(self, request):
        selected_ids = request.data.get("selected_ids", [])

        if type(selected_ids) != list:
            return Response({"error": "selected_ids must be an array."},status=status.HTTP_400_BAD_REQUEST)

        selected_ids = set(selected_ids)
        modules = Module.objects.filter(id__in=selected_ids)

        if len(modules) != len(selected_ids):
            return Response({"error": "One or more module IDs are invalid."},status=status.HTTP_400_BAD_REQUEST)

        # Validate prerequisites
        for module in modules:
            if module.prerequisite:
                if module.prerequisite.id not in selected_ids:
                    return Response({
                            "error": (
                                f"{module.title} requires completing {module.prerequisite.title} first."
                            )},status=status.HTTP_400_BAD_REQUEST)

        return Response({
                "message": "Learning path saved successfully.",
                "selected_ids": list(selected_ids)},status=status.HTTP_200_OK)