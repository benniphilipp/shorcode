from django.urls import path
from .views import home, RegisterView, CustomLoginView, ResetPasswordView, UserProfileView, SaveClickData, update_user_json, CustomUserJsonView, update_language
from django.contrib.auth import views as auth_views
from accounts.forms import LoginForm

app_name = 'accounts'

urlpatterns = [
    path('', home, name='users-home'),
    path('register/', RegisterView.as_view(), name='users-register'),
    path('logout/', auth_views.LogoutView.as_view(template_name='accounts/logout.html'), name='logout'),
    path('password-reset/', ResetPasswordView.as_view(), name='password_reset'),
    path('password-reset-complete/', auth_views.PasswordResetCompleteView.as_view(template_name='accounts/password_reset_complete.html'), name='password_reset_complete'),
    path('login/', CustomLoginView.as_view(redirect_authenticated_user=True, template_name='accounts/login.html', authentication_form=LoginForm), name='login'),
    path('profile/<pk>/', UserProfileView.as_view(), name='user-profile'),
    path('password-reset-confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='accounts/password_reset_confirm.html'), name='password_reset_confirm'),
    path('api/v1/save_click_data/', SaveClickData.as_view(), name='save_click_data'),
    path('<pk>/customer_json_adress/', CustomUserJsonView.as_view(), name='customer_json_adress'),
    path('<pk>/update_json/', update_user_json, name='update-user-json'),
    path('update_language/', update_language, name='update_language'),
]