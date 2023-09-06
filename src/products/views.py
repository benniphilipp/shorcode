import json
from django.urls import reverse
from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from django.views.generic.detail import DetailView
from django.views.generic import ListView
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404

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


def success(request):
    return render(request, 'success.html')


def create_payment_intent(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)

            price = data.get('price')
            print(price)
            amount = price  # Betrag in Cent (z.B. 10,00 USD)
            currency = 'usd'
            
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                payment_method_types=['card'],
            )
            
            return JsonResponse({'client_secret': intent.client_secret})
            # return JsonResponse({'client_secret': 'hello'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=403)
    else:
        return JsonResponse({'error': 'Ungültige Anfrage-Methode.'})


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(
            request.body.decode('utf-8'), sig_header, 'whsec_3c60cb04ed2b5ce97f32f3b468da8ea202a16b4108b7c569a8608d4a14375330'
        )
    except ValueError as e:
        # Ungültiges JSON
        return HttpResponse(status=400)

    # Verarbeiten Sie das Stripe-Ereignis basierend auf event.type
    if event.type == 'payment_intent.succeeded':
        # Hier können Sie Code für erfolgreiche Zahlungen ausführen
        print('WEBHOOK == payment_intent')
        pass
    elif event.type == 'payment_intent.payment_failed':
        # Hier können Sie Code für fehlgeschlagene Zahlungen ausführen
        print(event.type)
        print('WEBHOOK == payment_failed')
        pass

    return HttpResponse(status=200)


# def create_payment_intent(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             # Create a PaymentIntent with the order amount and currency
#             intent = stripe.PaymentIntent.create(
#                 amount=calculate_order_amount(data['items']),
#                 currency='eur',
#                 # In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
#                 automatic_payment_methods={
#                     'enabled': True,
#                 },
#             )
#             return JsonResponse({'clientSecret': intent['client_secret']})
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=403)
#     else:
#         return JsonResponse({'error': 'Ungültige Anfrage-Methode.'}, status=400)


class ProductDetailView(DetailView):
    model = Product
    slug_field = "id"
    template_name = "products.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        product = self.object
        context['product_json'] = {
            'id': product.id,
            'name': product.name,
            'price': float(product.price),
            'monthly_price': float(product.monthly_price),
            'tax': float(product.tax),
            'stage': product.stage,
            'content': product.content,
            'monthly_price_savings': product.monthly_price_savings,
            'savings_price': product.savings_price,
            'payment_abo': product.payment_abo
        }
        
        context['profile_form'] = ProfileFormAdresse()
        context['checkout_form'] = CheckoutForm()
        context['payment_form'] = PaymentForm()

        # Setzen Sie den Stripe-API-Schlüssel aus den Django-Einstellungen
        context['STRIPE_PUBLISHABLE_KEY'] = settings.STRIPE_PUBLISHABLE_KEY

        return context

    def render_to_response(self, context, **response_kwargs):
        if self.request.is_ajax():
            return JsonResponse(context['product_json'])
        return super().render_to_response(context, **response_kwargs)

  
class ProductListView(ListView):
    model = Product
    template_name = 'products_list.html'  # Hier können Sie Ihre HTML-Vorlage einstellen

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        amount = 1000
        currency = 'usd'
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            payment_method_types=['card'],
        )
        
        context['profile_form'] = ProfileFormAdresse()
        context['checkout_form'] = CheckoutForm()
        context['payment_form'] = PaymentForm()
        context['STRIPE_PUBLISHABLE_KEY'] = settings.STRIPE_PUBLISHABLE_KEY
        #'client_secret': intent.client_secret
        # context['client_secret'] = intent.client_secret
        
        return context
    
    def render_to_response(self, context):
        if self.request.is_ajax():
            products = Product.objects.filter(active=True)
            data = [
                {
                'id': product.id,
                'name': product.name,
                'price': float(product.price),
                'monthly_price': float(product.monthly_price),
                'tax': float(product.tax),
                'stage': product.stage,
                'content': product.content,
                'monthly_price_savings': product.monthly_price_savings,
                'savings_price': product.savings_price,
                }
                for product in products
            ]
            return JsonResponse(data, safe=False)
        return super().render_to_response(context)