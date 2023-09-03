from django.shortcuts import render
from django.http import JsonResponse
from django.views.generic.detail import DetailView
from .models import Product
from accounts.forms import ProfileFormAdresse
from .forms import CheckoutForm, PaymentForm

# Stripe
import stripe
from django.conf import settings
from django.http import JsonResponse

stripe.api_key = settings.STRIPE_SECRET_KEY
stripe.api_key = settings.STRIPE_PUBLISHABLE_KEY


def checkout(request):
    if request.method == 'POST':
        # Stripe-Zahlungsverarbeitung hier durchführen
        stripe.api_key = 'Ihr_Stripe_Secret_Key'

        try:
            # Stripe-Zahlungsmethode erstellen
            payment_method = stripe.PaymentMethod.create(
                type='card',
                card={
                    'number': request.POST['card_number'],
                    'exp_month': request.POST['exp_month'],
                    'exp_year': request.POST['exp_year'],
                    'cvc': request.POST['cvc'],
                },
            )

            # Stripe-Zahlung durchführen
            payment_intent = stripe.PaymentIntent.create(
                payment_method_types=['card'],
                amount=1000,  # Betrag in Cent (z. B. 10,00 €)
                currency='eur',
                payment_method=payment_method.id,
                confirm=True,
            )

            # Erfolgreiche Zahlung
            return JsonResponse({'message': 'Zahlung erfolgreich verarbeitet.'})

        except Exception as e:
            # Fehler bei der Zahlung
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Ungültige Anfrage.'})


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
            'tax': float(product.tax),
            'stage': product.stage,
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