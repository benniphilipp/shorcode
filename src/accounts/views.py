from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views import View
from django.contrib.auth.views import LoginView
import requests
from user_agents import parse
from analytics.models import ClickData

from django.contrib.auth.views import PasswordResetView
from django.contrib.messages.views import SuccessMessageMixin

from django.urls import reverse_lazy
from .models import CustomUser
from .forms import RegisterForm, LoginForm

from django.views.generic.detail import DetailView
from shortcode.models import ShortcodeClass

from analytics.models import ClickEvent, DailyClick, IPGeolocation

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.decorators import login_required

from django.shortcuts import get_object_or_404
from .models import APIKey 
from .serializers import ClickDataSerializer, DataSerializer

# Create your views here.
def home(request):
    return render(request, 'index.html')


class URLRedirectView(View):
    
    #https://ipapi.co/#api
    def get_user_agent_info(self, request):
        user_agent_string = request.META.get('HTTP_USER_AGENT', '')
        
        user_agent = parse(user_agent_string)
        os_info = user_agent.os.family  # Betriebssystem-Familie
        device_info = user_agent.device.family  # Geräte-Familie
        browser_info = user_agent.browser.family  # Browser-Familie
        
        user_agent_info = {
            'os': os_info,
            'device': device_info,
            'browser': browser_info
        }
        
        return user_agent_info
            
        
    def get(self, request, shortcode=None, *args, **kwargs):
        qs = ShortcodeClass.objects.filter(shortcode__iexact=shortcode)

        if qs.count() != 1 and not qs.exists():
            raise Http404

        obj = qs.first()
        user_agent_info = self.get_user_agent_info(request)

        ip_address = request.META.get('HTTP_X_REAL_IP', '')
        print(ip_address)
        
        # Referrer
        referrer = request.META.get('HTTP_REFERER', None)

        if referrer:
            # Verarbeite den Referrer hier weiter
            print(f"Referrer: {referrer}")
            
        try:
            response = requests.get(f'https://ipapi.co/{ip_address}/json/')
            if response.status_code == 200:
                data = response.json()

                latitude = data.get('latitude')
                longitude = data.get('longitude')
                city = data.get('city')
                country_name = data.get('country_name')
                region = data.get('region')

                ip_geolocation = IPGeolocation(
                    ip_address=ip_address,
                    latitude=latitude,
                    shortcode=obj,
                    longitude=longitude,
                    city=city,
                    country=country_name,
                    region=region,
                    os=user_agent_info['os'],
                    device=user_agent_info['device'],
                    browser=user_agent_info['browser']
                )
                ip_geolocation.save()
                print("IP Geolocation saved successfully!")  # Debug output
            else:
                print("IP API request failed with status code:", response.status_code)  # Debug output
                
        except requests.exceptions.RequestException:
                print("IP API request exception:", e) 
                latitude = 0.0
                longitude = 0.0
                city = "Unknown"
                country_name = "Unknown"
                region = "Unknown"

                ip_geolocation = IPGeolocation(
                    ip_address=ip_address,
                    latitude=latitude,
                    longitude=longitude,
                    city=city,
                    country=country_name,
                    region=region,
                    os=user_agent_info['os'],
                    device=user_agent_info['device'],
                    browser=user_agent_info['browser']
                )
                ip_geolocation.save()    
        
        ClickEvent.objects.create_event(obj)
        DailyClick.objects.create(short_url=obj)
        
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
    template_name = 'accounts/password_reset.html'
    email_template_name = 'accounts/password_reset_email.html'
    subject_template_name = 'accounts/password_reset_subject.txt'
    success_message = "We've emailed you instructions for setting your password, " \
                      "if an account exists with the email you entered. You should receive them shortly." \
                      " If you don't receive an email, " \
                      "please make sure you've entered the address you registered with, and check your spam folder."
    success_url = reverse_lazy('accounts:login')
    





# Save Click Data Websiet
class SaveClickData(APIView):
    authentication_classes = [TokenAuthentication]
    def post(self, request, format=None):

        user_email = request.data.get('user_email')

        try:
            user = CustomUser.objects.get(email=user_email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = DataSerializer(data=request.data)
        if serializer.is_valid():
            # Validierte Daten aus dem Serializer abrufen
            website_title = serializer.validated_data['website_title']
            website_url = serializer.validated_data['website_url']
            referrer = serializer.validated_data['referrer']
            ip_address = serializer.validated_data['ip_address']
            os = serializer.validated_data['os']
            device = serializer.validated_data['device']
            browser = serializer.validated_data['browser']
            try:
                ClickData.objects.create(
                    user=user,  # Aktuellen Benutzer speichern
                    website_title=website_title,
                    website_url=website_url,
                    referrer=referrer,
                    ip_address=ip_address,
                    os=os,
                    device=device,
                    browser=browser
                )
                return Response({'message': 'Data received and stored.'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'message': 'Error while storing data.', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)








