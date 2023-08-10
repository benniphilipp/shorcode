from django.contrib import admin

# Register your models here.


from .models import ClickEvent, DailyClick

admin.site.register(ClickEvent)
admin.site.register(DailyClick)