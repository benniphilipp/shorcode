import json
from django.urls import reverse
from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from django.views.generic.detail import DetailView

from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404

from django.http import HttpResponseRedirect

from .models import Product
from accounts.forms import ProfileFormAdresse
from .forms import CheckoutForm, PaymentForm

# Stripe
import stripe
from django.conf import settings
from django.http import JsonResponse

STRIPE_SECRET_KEY = settings.STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY = settings.STRIPE_PUBLISHABLE_KEY
stripe.api_key = STRIPE_SECRET_KEY
YOUR_DOMAIN = 'http://127.0.0.1:8000'

def success(request):
    return render(request, 'success.html')

def cancel(request):
    return render(request, 'cancel.html')

class ProductListView(View):
    template_name = 'products_list.html'
    
    def get(self, request):
        products = Product.objects.filter(active=True)
        
        context = {
            'publishable_key': STRIPE_PUBLISHABLE_KEY,
            'products': products,
            'user': request.user
        }
        
        # if request.user.is_authenticated:
        #     context['user'] = request.user
        return render(request, self.template_name, context)
    

@csrf_exempt
def create_checkout_session_subscription(request):
    current_language = request.LANGUAGE_CODE
    
    product_id = request.GET.get('product_id')
    product = Product.objects.get(id=product_id)
    
    session = stripe.checkout.Session.create(
    payment_method_types=['card'],
    line_items=[{
        'price': product.price_id,
        'quantity': 1,
    }],
    mode='subscription',
    success_url=YOUR_DOMAIN + '/' + current_language + '/products/success',
    cancel_url=YOUR_DOMAIN + '/' + current_language + '/products/cancel',
    )
    return JsonResponse({'id': session.id})


@csrf_exempt
def create_checkout_session(request):
    current_language = request.LANGUAGE_CODE
    
    product_id = request.GET.get('product_id')
    product = Product.objects.get(id=product_id)
    print(product_id)
    session = stripe.checkout.Session.create(
    payment_method_types=['card'],
    line_items=[{
        'price_data': {
            'currency': 'usd',
            'product_data': {
                'name': product.name,
            },
            'unit_amount': int(product.price * 100),
        },
        'quantity': 1,
    }],
    mode='payment',
    success_url=YOUR_DOMAIN + '/' + current_language + '/products/success',
    cancel_url=YOUR_DOMAIN + '/' + current_language + '/products/cancel',
    )
    return JsonResponse({'id': session.id})
  

