from django.urls import path
from .views import ProductListView, cancel, success, create_checkout_session, create_checkout_session_subscription
app_name = 'products'

urlpatterns = [
    path('', ProductListView.as_view(), name='product_list'),
    path('success/', success, name='success-page'),
    path('cancel/', cancel, name='cancel-page'),
    path('create-checkout-session/', create_checkout_session, name='create_checkout_session'),
    path('create-checkout-session-subscription/', create_checkout_session_subscription, name='create_checkout_session_subscription'),
    # path('stripe-webhook/', stripe_webhook, name='stripe_webhook'),
]

# stripe listen --forward-to http://127.0.0.1:8000/stripe-webhook/