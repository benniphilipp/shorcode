        """
        Okay wir müssen jetzt noch abfragen ob Andoird on ist wen ja dann zur alternative URL weiterleiten.
        android_on_off = models.BooleanField(default=False)
        android = models.CharField(max_length=320, blank=True, null=True)
        
        Und das gleiche auch bei IOS weiter leiten zur Alternative URL wen IOS ist.
        ios_on_off = models.BooleanField(default=False)
        ios = models.CharField(max_length=320, blank=True, null=True)
        """


# class URLRedirectView(View):
    
#      #https://ipapi.co/#api
#     def get_user_agent_info(self, request):
#         user_agent_string = request.META.get('HTTP_USER_AGENT', '')
        
#         user_agent = parse(user_agent_string)
#         os_info = user_agent.os.family  # Betriebssystem-Familie
#         device_info = user_agent.device.family  # Geräte-Familie
#         browser_info = user_agent.browser.family  # Browser-Familie
        
#         user_agent_info = {
#             'os': os_info,
#             'device': device_info,
#             'browser': browser_info
#         }
        
#         return user_agent_info

#     def get(self, request, shortcode=None, *args, **kwargs):
#         qs = ShortcodeClass.objects.filter(shortcode__iexact=shortcode)

#         if qs.count() != 1 and not qs.exists():
#             raise Http404

#         obj = qs.first()
#         user_agent_info = self.get_user_agent_info(request)

#         ip_address = request.META.get('HTTP_X_REAL_IP', '')
#         print(ip_address)
        
#         # Referrer
#         referrer = request.META.get('HTTP_REFERER', None)

#         if referrer:
#             # Verarbeite den Referrer hier weiter
#             print(f"Referrer: {referrer}")
            
#         try:
#             response = requests.get(f'https://ipapi.co/{ip_address}/json/')
#             if response.status_code == 200:
#                 data = response.json()

#                 latitude = data.get('latitude')
#                 longitude = data.get('longitude')
#                 city = data.get('city')
#                 country_name = data.get('country_name')
#                 region = data.get('region')

#                 ip_geolocation = IPGeolocation(
#                     ip_address=ip_address,
#                     latitude=latitude,
#                     shortcode=obj,
#                     longitude=longitude,
#                     city=city,
#                     country=country_name,
#                     region=region,
#                     os=user_agent_info['os'],
#                     device=user_agent_info['device'],
#                     browser=user_agent_info['browser']
#                 )
#                 ip_geolocation.save()
#                 print("IP Geolocation saved successfully!")  # Debug output
#             else:
#                 print("IP API request failed with status code:", response.status_code)  # Debug output
                        
#         except requests.exceptions.RequestException as e:
#             print("IP API request exception:", e) 
#             latitude = 0.0
#             longitude = 0.0
#             city = "Unknown"
#             country_name = "Unknown"
#             region = "Unknown"

#             ip_geolocation = IPGeolocation(
#                 ip_address=ip_address,
#                 latitude=latitude,
#                 longitude=longitude,
#                 city=city,
#                 country=country_name,
#                 region=region,
#                 os=user_agent_info['os'],
#                 device=user_agent_info['device'],
#                 browser=user_agent_info['browser']
#             )
#             ip_geolocation.save()
                
        
#         # Überprüfe, ob 'limitation_active' aktiv ist und ob 'count' erreicht ist
#         if obj.limitation_active and obj.count <= 0:
#             # Wenn 'limitation_active' aktiv ist und 'count' erreicht ist, leite zur alternativen URL weiter
#             if obj.alternative_url:
#                 return HttpResponseRedirect(obj.alternative_url)
#             else:
#                 return HttpResponse("Alternative URL not set", status=500)
        
#         # Überprüfe, ob 'start_date' und 'end_date' gesetzt sind
#         if obj.start_date and obj.end_date:
#             current_date = timezone.now()
#             # Überprüfe, ob das aktuelle Datum innerhalb des Zeitraums von 'start_date' bis 'end_date' liegt
#             if current_date < obj.start_date or current_date > obj.end_date:
#                 # Wenn nicht, leite zur alternativen URL weiter
#                 if obj.alternative_url:
#                     return HttpResponseRedirect(obj.alternative_url)
#                 else:
#                     return HttpResponse("Alternative URL not set", status=500)
        
#         # Reduziere den Zähler 'count' nur, wenn 'count' größer als null ist
#         if obj.count > 0:
#             obj.count -= 1
#             obj.save()
        
#         ClickEvent.objects.create_event(obj)
#         DailyClick.objects.create(short_url=obj)
        
#         global url_basic
#         global utm_campaign
#         global utm_content
#         global utm_term

#         gola_url = obj.url_destination
#         if obj.url_source and obj.url_medium:
#             url_basic = '?utm_medium=' + obj.url_medium + '&utm_source=' + obj.url_source
#         else:
#             url_basic = ''
#         if obj.url_campaign:
#             utm_campaign = '&utm_campaign=' + obj.url_campaign
#         else:
#             utm_campaign = ''
#         if obj.url_term:
#             utm_term = '&utm_term=' + obj.url_term
#         else:
#             utm_term = ''
#         if obj.url_content:
#             utm_content = '&utm_content=' + obj.url_content
#         else:
#             utm_content = ''
            
#         url = gola_url + url_basic + utm_campaign + utm_content + utm_term
        
#         return HttpResponseRedirect(url)
    
    
        # Ok jetzt 
        
        """"
        Ok jetzt mach wir die weiterleitung anhand von geo daten.
        
        geo_targeting_on_off true ist.
        Wen GeoThemplate land germany ist werden alle die aus germany kommen weiter geleitet oder wen germany ist und aus einer bestimmten region kommen werden sie auch auf die Alternative URL weiter gelitet.
        
        Das ist die GeoThemplate Modal Class
        themplate_name = models.CharField(max_length=255, blank=True, null=True)
        land = models.CharField(max_length=255, blank=True, null=True)
        themplate_region = models.CharField(max_length=255, blank=True, null=True) 
    
        das sind die Daten ShortcodeClass Modal
        geo_targeting_on_off = models.BooleanField(default=False)
        link_geo = models.CharField(max_length=320, blank=True, null=True)
        template_geo = models.ManyToManyField(GeoThemplate, related_name='geothemplate')
        
        ich hofe du verstehest es den rest des codes bitte beibehalten der aktuelle stand gebe ich dir mit dazu.
        
        
        """

# class URLRedirectView(View):
    
#     #https://ipapi.co/#api
#     def get_user_agent_info(self, request):
#         user_agent_string = request.META.get('HTTP_USER_AGENT', '')
        
#         user_agent = parse(user_agent_string)
#         os_info = user_agent.os.family  # Betriebssystem-Familie
#         device_info = user_agent.device.family  # Geräte-Familie
#         browser_info = user_agent.browser.family  # Browser-Familie
        
#         user_agent_info = {
#             'os': os_info,
#             'device': device_info,
#             'browser': browser_info
#         }
        
#         return user_agent_info
            
        
#     def get(self, request, shortcode=None, *args, **kwargs):
#         qs = ShortcodeClass.objects.filter(shortcode__iexact=shortcode)

#         if qs.count() != 1 and not qs.exists():
#             raise Http404

#         obj = qs.first()
#         user_agent_info = self.get_user_agent_info(request)

#         ip_address = request.META.get('HTTP_X_REAL_IP', '')
#         print(ip_address)
        
#         # Referrer
#         referrer = request.META.get('HTTP_REFERER', None)

#         if referrer:
#             # Verarbeite den Referrer hier weiter
#             print(f"Referrer: {referrer}")
            
#         try:
#             response = requests.get(f'https://ipapi.co/{ip_address}/json/')
#             if response.status_code == 200:
#                 data = response.json()

#                 latitude = data.get('latitude')
#                 longitude = data.get('longitude')
#                 city = data.get('city')
#                 country_name = data.get('country_name')
#                 region = data.get('region')

#                 ip_geolocation = IPGeolocation(
#                     ip_address=ip_address,
#                     latitude=latitude,
#                     shortcode=obj,
#                     longitude=longitude,
#                     city=city,
#                     country=country_name,
#                     region=region,
#                     os=user_agent_info['os'],
#                     device=user_agent_info['device'],
#                     browser=user_agent_info['browser']
#                 )
#                 ip_geolocation.save()
#                 print("IP Geolocation saved successfully!")  # Debug output
#             else:
#                 print("IP API request failed with status code:", response.status_code)  # Debug output
                
#         except requests.exceptions.RequestException:
#                 print("IP API request exception:", e) 
#                 latitude = 0.0
#                 longitude = 0.0
#                 city = "Unknown"
#                 country_name = "Unknown"
#                 region = "Unknown"

#                 ip_geolocation = IPGeolocation(
#                     ip_address=ip_address,
#                     latitude=latitude,
#                     longitude=longitude,
#                     city=city,
#                     country=country_name,
#                     region=region,
#                     os=user_agent_info['os'],
#                     device=user_agent_info['device'],
#                     browser=user_agent_info['browser']
#                 )
#                 ip_geolocation.save()    
        
#         ClickEvent.objects.create_event(obj)
#         DailyClick.objects.create(short_url=obj)
        
#         global url_basic
#         global utm_campaign
#         global utm_content
#         global utm_term

#         gola_url = obj.url_destination
#         if obj.url_source and obj.url_medium:
#             url_basic = '?utm_medium=' + obj.url_medium + '&utm_source=' + obj.url_source
#         else:
#             url_basic = ''
#         if obj.url_campaign:
#             utm_campaign = '&utm_campaign=' + obj.url_campaign
#         else:
#             utm_campaign = ''
#         if obj.url_term:
#             utm_term = '&utm_term=' + obj.url_term
#         else:
#             utm_term = ''
#         if obj.url_content:
#             utm_content = '&utm_content=' + obj.url_content
#         else:
#             utm_content = ''
            
#         url = gola_url + url_basic + utm_campaign + utm_content + utm_term
        
#         return HttpResponseRedirect(url)

        # limitation_active abfrage
        
        # start_date und end_date ist nicht gesetzt
        
        # dann muss count runter gezält werden wen nur erreicht ist dann weiterleiten.
        
        # ist start_date und end_date muss das jetztige datum in diesen bereich liegen das die weiterleung greift ansonst gehen wir zur alternative url.