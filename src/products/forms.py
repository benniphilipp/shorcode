from django import forms
from .models import PromoCode, Product


class CheckoutForm(forms.Form):
    promo_code = forms.CharField(
        label="",
        max_length=20,
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': "Recipient's username", 'aria-describedby': "button-addon2"}),
    )
    
    
class PaymentForm(forms.Form):
    user = forms.HiddenInput()
    product = forms.ModelChoiceField(queryset=Product.objects.all(), empty_label=None)
    card_number = forms.CharField(max_length=16)
    exp_month = forms.CharField(max_length=2)
    exp_year = forms.CharField(max_length=4)
    cvc = forms.CharField(max_length=3) 