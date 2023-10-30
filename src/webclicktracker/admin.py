from django.contrib import admin
from .models import WebsitePages, Link, Button, Website, Subpage
# Register your models here.

admin.site.register(WebsitePages)
admin.site.register(Link)
admin.site.register(Button)
admin.site.register(Website)
admin.site.register(Subpage)