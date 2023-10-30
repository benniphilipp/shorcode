from django.forms import ModelForm, HiddenInput
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Row, Column, HTML, Hidden

from django import forms
from .models import PromoCode, Payment, Product


class CheckoutForm(forms.Form):
    promo_code = forms.CharField(
        label="",
        max_length=20,
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': "Recipient's username", 'aria-describedby': "button-addon2"}),
    )
    
    
class PaymentForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None) 
        super(PaymentForm, self).__init__(*args, **kwargs)

        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('card_number', css_class='form-group col-12 my-2 disabled-func'),
                css_class='row'
            ),
            Row(
                Column('exp_month', css_class='form-group col-md-6 my-2 disabled-func'),
                Column('exp_year', css_class='form-group col-md-6 my-2 disabled-func'),
                Column('cvc', css_class='form-group col-md-6 my-2 disabled-func'),
                css_class='row'
            ),
            HTML('<button type="submit" class="btn btn-primary mt-3 mb-3">Zahlung abschließen</button>')
        )
        
    class Meta:
        model = Payment
        fields = ['user', 'product', 'card_number', 'exp_month', 'exp_year', 'cvc']
        widgets = {
            'user': HiddenInput(),
            'product': HiddenInput(),
        }