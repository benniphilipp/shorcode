from django.views.generic.base import View
from django.shortcuts import render
from datetime import timedelta, date, datetime
from collections import Counter
from django.db.models import Sum

from django.db.models import Count
from django.db.models.functions import TruncDate
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views import View
from .models import ClickEvent, DailyClick, IPGeolocation, ClickEvent
from shortcode.models import ShortcodeClass

'''
@ToDo
    - 1.    Automatisches Versenden von Analyseberichten.
    - 2.    Intelligente Vorschläge für optimale Veröffentlichung Zeitpunkte
    - 3.    Websiten beuscher Zeitraum auf 24 Studen wan in wlecher zeit sind die meisten besucher auf der Website
    - 4.    Logo Tauschen
'''


# Create your views here.
class AnalyticsView(View):
  def get(self, request, *args, **kwargs):
        return render(request, "analytics.html")


def click_analyse(request, shortcode):

        obj = ShortcodeClass.objects.get(pk=shortcode)
        
        daily_clicks = obj.daily_clicks.all() 
        
        # Landdaten für Klicks sammeln
        country_clicks = {}
        for click in daily_clicks:
            ip_geolocation = IPGeolocation.objects.filter(shortcode=click.short_url).first()
            if ip_geolocation:
                country = ip_geolocation.country
                if country in country_clicks:
                    country_clicks[country] += 1
                else:
                    country_clicks[country] = 1
                  
        country_labels = list(country_clicks.keys())
        country_values = list(country_clicks.values())  
                    
        # # Erstellungsdatum
        created_at_datetime = obj.created_at
        creation_date = created_at_datetime.strftime('%Y-%m-%d')

        # # # Klicks in den gewünschten Zeiträumen
        today = date.today()
        thirty_days_ago = today - timedelta(days=31)
        ninety_days_ago = today - timedelta(days=90)
        one_twenty_days_ago = today - timedelta(days=120)
        one_year_ago = today - timedelta(days=365)
        
        # Prüfe, ob der Link mindestens 30 - 120 Tage alt ist
        if obj.created_at.date() <= thirty_days_ago:
            clicks_30_days = ClickEvent.objects.filter(short_url=obj, timestamp__gte=thirty_days_ago).count()
        else:
            clicks_30_days = 0
        
        if obj.created_at.date() <= ninety_days_ago:
            clicks_90_days = ClickEvent.objects.filter(short_url=obj, timestamp__gte=ninety_days_ago).count()
        else:
            clicks_90_days = 0
        
        if obj.created_at.date() <= one_twenty_days_ago:
            clicks_120_days = ClickEvent.objects.filter(short_url=obj, timestamp__gte=one_twenty_days_ago).count()
        else:
            clicks_120_days = 0
            
        if obj.created_at.date() <= one_year_ago:
            clicks_365_days = ClickEvent.objects.filter(short_url=obj, timestamp__gte=one_year_ago).count()
        else:
            clicks_365_days = 0
            
        # Landdaten für Klicks sammeln
        country_clicks = Counter()
        for click in daily_clicks:
            ip_geolocation = IPGeolocation.objects.filter(shortcode=click.short_url).first()
            if ip_geolocation:
                country = ip_geolocation.country
                country_clicks[country] += 1

        # Die Top-N-Länder ermitteln
        top_countries = country_clicks.most_common(10)

        
        # # # Datum der letzten Änderung
        update_at_datetime = obj.updated_at
        last_modification_date = update_at_datetime.strftime('%Y-%m-%d')

        # # # Weiterleitungen
        daily_clicks = obj.daily_clicks.all()
        redirections_counter = Counter(click.short_url.url_destination for click in daily_clicks)

        # Browserdaten sammeln und zählen
        browser_data = IPGeolocation.objects.filter(shortcode=obj).values('browser').annotate(count=Count('browser')).order_by('-count')[:10]
        top_browsers = [(browser['browser'], browser['count']) for browser in browser_data]
        
        # Betriebssystemdaten sammeln und zählen
        os_data = IPGeolocation.objects.filter(shortcode=obj).values('os').annotate(count=Count('os')).order_by('-count')[:10]
        top_os = [(os['os'], os['count']) for os in os_data]
        
        # Top-Referrer sammeln und zählen
        top_referrers_data = IPGeolocation.objects.filter(shortcode=obj).values('referrer').annotate(count=Count('referrer')).order_by('-count')[:10]
        top_referrers = [(referrer['referrer'], referrer['count']) for referrer in top_referrers_data]
        
        # Daten für ApexCharts
        data = {
            'creation_date': creation_date,
            'clicks_30_days': clicks_30_days,
            'clicks_90_days': clicks_90_days,
            'clicks_120_days': clicks_120_days,
            'clicks_365_days': clicks_365_days,
            'last_modification_date': last_modification_date,
            'redirections_counter': redirections_counter,
            'country_labels': country_labels,
            'country_values': country_values,
            'top_countries': top_countries,
            'top_browsers': top_browsers,
            'top_os': top_os,
            'top_referrers': top_referrers,
            'url': obj.get_short_url,
            'url_destination': obj.url_destination
            #Füge hier die Daten für die ApexCharts hinzu
        }
    

        return JsonResponse(data)


def total_links_json_view(request):
    total_links = ShortcodeClass.objects.filter(url_creator=request.user, url_archivate=False).count()
    total_archiv = ShortcodeClass.objects.filter(url_creator=request.user, url_archivate=True).count()
    
    total_clicks = ClickEvent.get_total_clicks_for_user(request.user)
    
    item = {
        'total_links': total_links,
        'total_archiv': total_archiv,
        'total_clicks': total_clicks,
        }

    return JsonResponse(item)
