from django.urls import path
from .views import home, RegisterView, CustomLoginView

from django.contrib.auth import views as auth_views
# from user.views import CustomLoginView, ResetPasswordView
from accounts.forms import LoginForm

from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', home, name='users-home'),
    path('register/', RegisterView.as_view(), name='users-register'),
    path('login/', CustomLoginView.as_view(redirect_authenticated_user=True, template_name='accounts/login.html',
                                           authentication_form=LoginForm), name='login'),
    path('logout/', auth_views.LogoutView.as_view(template_name='accounts/logout.html'), name='logout'),
    # path('password-reset/', ResetPasswordView.as_view(), name='password_reset'),
    # path('password-reset-confirm/<uidb64>/<token>/',
    #      auth_views.PasswordResetConfirmView.as_view(template_name='user/password_reset_confirm.html'),
    #      name='password_reset_confirm'),
]