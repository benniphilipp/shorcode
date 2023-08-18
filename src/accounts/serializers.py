from rest_framework import serializers
from .models import APIKey

class ClickDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey  # Annahme: Du hast ein Modell ClickData
        fields = '__all__'