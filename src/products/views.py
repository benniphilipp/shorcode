import json
from django.urls import reverse
from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from django.views.generic.detail import DetailView

from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.core.mail import send_mail
from django.core.mail import get_connection, EmailMessage
from django.conf import settings
from django.shortcuts import get_object_or_404

from django.http import HttpResponseRedirect

from accounts.models import CustomUser
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
    email = request.user.email
    
    product_id = request.GET.get('product_id')
    product = Product.objects.get(id=product_id)
    
    session = stripe.checkout.Session.create(
    payment_method_types=['card'],
    line_items=[{
        'price': product.price_id,
        'quantity': 1,
    }],
    mode='subscription',
    customer_email= email,
    success_url=YOUR_DOMAIN + '/' + current_language + '/products/success',
    cancel_url=YOUR_DOMAIN + '/' + current_language + '/products/cancel',
    )
    return JsonResponse({'id': session.id})


@csrf_exempt
def create_checkout_session(request):
    current_language = request.LANGUAGE_CODE
    email = request.user.email
    
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
    customer_email= email,
    success_url=YOUR_DOMAIN + '/' + current_language + '/products/success',
    cancel_url=YOUR_DOMAIN + '/' + current_language + '/products/cancel',
    )
    return JsonResponse({'id': session.id})



@csrf_exempt
@require_POST
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = "whsec_387e284660acf96e06a67a70c9aab7e4d5212f02b29edaf4578312288c5323ec"  # Set your webhook secret here

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        return JsonResponse({'error': str(e)}, status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return JsonResponse({'error': str(e)}, status=400)

    if event.type == 'payment_intent.succeeded':
        # Extrahieren Sie die relevanten Informationen aus dem Event
        session = event['data']['object']
        charges = session['charges']['data']

        for charge in charges:
            email = charge['billing_details']['email']

        # Finden Sie den Benutzer anhand der Kunden-ID oder anderen Informationen
        user = CustomUser.objects.get(email=email)

        # Aktualisieren Sie den Benutzerstatus
        user.free_user = False
        user.save()
        
        # receiver_email = email  # Setzen Sie die E-Mail-Adresse des Kunden
        # subject = 'Zahlung erfolgreich'
        # message = 'Ihre Zahlung wurde erfolgreich verarbeitet. Vielen Dank!'
        # from_email = 'ihre_email@example.com'  # Die Absender-E-Mail-Adresse
        
        # connection = get_connection(username=settings.EMAIL_HOST_USER, password=settings.EMAIL_HOST_PASSWORD)
        # email = EmailMessage(subject, message, from_email, [receiver_email], connection=connection)

        # E-Mail senden
        # email.send()

    return JsonResponse({'message': 'Webhook received successfully'}, status=200)


