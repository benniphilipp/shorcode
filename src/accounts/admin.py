from django.contrib import admin

from .models import CustomUser, APIKey
import string
import secrets

admin.site.register(CustomUser)


class APIKeyAdmin(admin.ModelAdmin):

    def save_model(self, request, obj, form, change):
        if not obj.key:
            obj.key = self.generate_key()
        super().save_model(request, obj, form, change)

    @staticmethod
    def generate_key(length=32):
        characters = string.ascii_letters + string.digits
        api_key = ''.join(secrets.choice(characters) for _ in range(length))
        return api_key

admin.site.register(APIKey, APIKeyAdmin)