from django.contrib import admin

from .models import CustomUser, APIKey
import string
import secrets
from rest_framework.authtoken.models import Token

admin.site.register(CustomUser)




class APIKeyAdmin(admin.ModelAdmin):

    def save_model(self, request, obj, form, change):
        if not obj.key:
            obj.key = self.generate_key()
            user = obj.user
            self.create_or_update_token(user)
        obj.save()  # Speichere das APIKey-Objekt
        super().save_model(request, obj, form, change)

    def create_or_update_token(self, user):
        try:
            token = Token.objects.get(user=user)
            token.delete()  # Lösche das vorhandene Token
        except Token.DoesNotExist:
            pass  # Kein vorhandenes Token, nichts zu löschen

        Token.objects.create(user=user)  # Erstelle ein neues Token

    @staticmethod
    def generate_key(length=32):
        characters = string.ascii_letters + string.digits
        api_key = ''.join(secrets.choice(characters) for _ in range(length))
        return api_key

admin.site.register(APIKey, APIKeyAdmin)












