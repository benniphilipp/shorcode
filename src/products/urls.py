from django.urls import path
from .views import ProductDetailView, ProductListView, create_payment_intent, success, stripe_webhook
app_name = 'products'

urlpatterns = [
    path('', ProductListView.as_view(), name='product_list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product_detail'),
    path('create-payment-intent/', create_payment_intent, name='create_payment_intent'),
    path('success/', success, name='success-page'),
    path('stripe-webhook/', stripe_webhook, name='stripe_webhook'),
]