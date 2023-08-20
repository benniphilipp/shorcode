from django.contrib import admin
from .models import WebsiteClick, Link, Button, Website
# Register your models here.

admin.site.register(WebsiteClick)
admin.site.register(Link)
admin.site.register(Button)
admin.site.register(Website)
