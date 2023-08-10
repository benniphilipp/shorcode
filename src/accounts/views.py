from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views import View
from django.contrib.auth.views import LoginView

from django.contrib.auth.views import PasswordResetView
from django.contrib.messages.views import SuccessMessageMixin

from django.urls import reverse_lazy
from .models import CustomUser
from .forms import RegisterForm, LoginForm

from django.views.generic.detail import DetailView
from shortcode.models import ShortcodeClass

from analytics.models import ClickEvent

# Create your views here.
def home(request):
    return render(request, 'index.html')




class URLRedirectView(View):
        
    def get(self, request, shortcode=None, *args, **kwargs):
        qs = ShortcodeClass.objects.filter(shortcode__iexact=shortcode)
        print(qs)
        if qs.count() != 1 and not qs.exists():
            raise Http404

        obj = qs.first()
        
        print(ClickEvent.objects.create_event(obj))
        
        global url_basic
        global utm_campaign
        global utm_content
        global utm_term

        gola_url = obj.url_destination
        if obj.url_source and obj.url_medium:
            url_basic = '?utm_medium=' + obj.url_medium + '&utm_source=' + obj.url_source
        else:
            url_basic = ''
        if obj.url_campaign:
            utm_campaign = '&utm_campaign=' + obj.url_campaign
        else:
            utm_campaign = ''
        if obj.url_term:
            utm_term = '&utm_term=' + obj.url_term
        else:
            utm_term = ''
        if obj.url_content:
            utm_content = '&utm_content=' + obj.url_content
        else:
            utm_content = ''
            
        url = gola_url + url_basic + utm_campaign + utm_content + utm_term

        return HttpResponseRedirect(url)


class UserProfileView(DetailView):
    model = CustomUser
    slug_field = "id"
    template_name = "userprofile.html"


class RegisterView(View):
    form_class = RegisterForm
    initial = {'key': 'value'}
    template_name = 'accounts/register.html'

    def get(self, request, *args, **kwargs):
        form = self.form_class(initial=self.initial)
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)

        if form.is_valid():
            form.save()

            return redirect(to='/')

        return render(request, self.template_name, {'form': form})
    
    def dispatch(self, request, *args, **kwargs):
        # will redirect to the home page if a user tries to access the register page while logged in
        if request.user.is_authenticated:
            return redirect(to='/')

        # else process dispatch as it otherwise normally would
        return super(RegisterView, self).dispatch(request, *args, **kwargs)
    
    
    
# Class based view that extends from the built in login view to add a remember me functionality
class CustomLoginView(LoginView):
    form_class = LoginForm

    def form_valid(self, form):
        remember_me = form.cleaned_data.get('remember_me')

        if not remember_me:
            # set session expiry to 0 seconds. So it will automatically close the session after the browser is closed.
            self.request.session.set_expiry(0)

            # Set session as modified to force data updates/cookie to be saved.
            self.request.session.modified = True

        # else browser session will be as long as the session cookie time "SESSION_COOKIE_AGE" defined in settings.py
        return super(CustomLoginView, self).form_valid(form)



class ResetPasswordView(SuccessMessageMixin, PasswordResetView):
    template_name = 'user/password_reset.html'
    email_template_name = 'users/password_reset_email.html'
    subject_template_name = 'users/password_reset_subject'
    success_message = "We've emailed you instructions for setting your password, " \
                      "if an account exists with the email you entered. You should receive them shortly." \
                      " If you don't receive an email, " \
                      "please make sure you've entered the address you registered with, and check your spam folder."
    success_url = reverse_lazy('users-home')
    
