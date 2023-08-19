from rest_framework import serializers
from .models import APIKey

class ClickDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey  # Annahme: Du hast ein Modell ClickData
        fields = '__all__'
        


class DataSerializer(serializers.Serializer):
    website_title = serializers.CharField(max_length=255)
    website_url = serializers.URLField()
    referrer = serializers.CharField(max_length=255)
    ip_address = serializers.IPAddressField()
    os = serializers.CharField(max_length=255)
    device = serializers.CharField(max_length=255)
    browser = serializers.CharField(max_length=255)