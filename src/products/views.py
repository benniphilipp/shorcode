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
            pk = data.get('pk')
            
            try:
                product = Product.objects.get(pk=pk) 
                amount_in_cents = int(product.price * 100) 

            except Product.DoesNotExist:
                print(f"Das Produkt mit dem PK {pk} wurde nicht gefunden.")
            
            amount = amount_in_cents # Betrag in Cent (z.B. 10,00 USD)
            currency = 'usd'
            
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                payment_method_types=['card'],
            )
            
            return JsonResponse({'client_secret': intent.client_secret})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=403)
    else:
        return JsonResponse({'error': 'Ungültige Anfrage-Methode.'})

# Stripe
@csrf_exempt
def stripe_webhook(request):
    # Erfassen des Payloads und der Signatur aus der Anfrage
    # payload = request.body
    # sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        
    # try:
    #     # Versuchen, das Webhook-Ereignis zu erstellen und zu überprüfen
    #     event = stripe.Webhook.construct_event(
    #         payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
    #     )
    # except ValueError as e:
    #     # Fehlerhafte Nutzlast, ungültiges JSON
    #     return HttpResponse(status=400)
    # except stripe.error.SignatureVerificationError as e:
    #     # Ungültige Signatur, möglicherweise betrügerisch
    #     return HttpResponse(status=400)

    # # Wenn das Webhook-Ereignis den Status "payment_intent.succeeded" hat,
    # # bedeutet dies, dass die Zahlung erfolgreich war
    # if event.type == 'payment_intent.succeeded':
    #     payment_intent = event.data.object
    #     print('succeeded')
        
    #     # Hier können Sie den Status der Zahlung und weitere Informationen aktualisieren
    #     # und beispielsweise den Auftragsstatus auf "bezahlt" setzen
    # if event.type == 'payment_intent.payment_failed':
    #     payment_intent = event.data.object
    #     print('payment_failed')
    # # Weitere Ereignisse wie 'payment_intent.failed', 'charge.refunded', usw. können ebenfalls verarbeitet werden
    print('Webhook')
    # Geben Sie eine erfolgreiche Antwort zurück, um Stripe zu bestätigen
    return HttpResponse(status=200)



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
                
        context['profile_form'] = ProfileFormAdresse()
        context['checkout_form'] = CheckoutForm()
        context['payment_form'] = PaymentForm()
        context['STRIPE_PUBLISHABLE_KEY'] = settings.STRIPE_PUBLISHABLE_KEY
        
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