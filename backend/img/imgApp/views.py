from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
import json
from rest_framework import generics
from rest_framework.permissions import AllowAny


class ReactView(APIView):
    serializer_class = ReactSerializer

    def get(self, request):
        details = React.objects.all().prefetch_related('annotations')
        serialized_data = []
        for react_obj in details:
            image_url = request.build_absolute_uri(react_obj.image.url)

            annotations = [annotation.text for annotation in react_obj.annotations.all()]
            serialized_data.append({
                'name': react_obj.name,
                # 'image_path': react_obj.image_path,
                'image_url': image_url,
                'annotations': annotations
            })
        return Response(serialized_data)


    def post(self, request):
        react_data = {
            'name': request.data.get('name'),
            'image': request.FILES.get('image'),
        }
        annotations_data = json.loads(request.data.get('annotations', '[]'))

        serializer = ReactSerializer(data=react_data)
        if serializer.is_valid(raise_exception=True):
            react = serializer.save()

            for annotation_text in annotations_data:
                annotation = Annotation(react=react, text=annotation_text)
                annotation.save()

            return Response(serializer.data)     
        
class UserCreateAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
