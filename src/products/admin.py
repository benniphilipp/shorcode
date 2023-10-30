from django.contrib import admin
from .models import Product, PromoCode, Payment, Subscription

admin.site.register(Product)
admin.site.register(PromoCode)
admin.site.register(Payment)
admin.site.register(Subscription)
