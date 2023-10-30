from django.db import models
from accounts.models import CustomUser
from ckeditor.fields import RichTextField

class PromoCode(models.Model):
    code = models.CharField(max_length=20, unique=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()

    def __str__(self):
        return self.code


class Product(models.Model):
    
    PRODUCT_STAGES = (
        ('Growth', 'Growth'),
        ('Core', 'Core'),
        ('Premium', 'Premium'),
    )
    
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    monthly_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    tax = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    stage = models.CharField(max_length=10, choices=PRODUCT_STAGES, default='Growth')
    promo_code = models.ForeignKey(PromoCode, null=True, blank=True, on_delete=models.SET_NULL)
    active = models.BooleanField(default=True)
    content = models.TextField(null=True, blank=True)
    monthly_price_savings = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    savings_price = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    payment_abo = models.BooleanField(default=True)
    price_id = models.CharField(max_length=100, default='price_1O6ZIkFJc5Umrifwi3hxGJ74', blank=True)
    button_id = models.CharField(max_length=100, default='checkout-button', blank=True)
    
    def __str__(self):
        return self.name


class Payment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    card_number = models.CharField(max_length=16)
    exp_month = models.CharField(max_length=2)
    exp_year = models.CharField(max_length=4)
    cvc = models.CharField(max_length=3) 

    timestamp = models.DateTimeField(auto_now_add=True)  # Datum und Uhrzeit der Zahlung

    def __str__(self):
        return f"Zahlung von {self.user.username} für {self.product.name} am {self.timestamp}"
    
    
class Subscription(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username}'s {self.product.name} Subscription"
    
