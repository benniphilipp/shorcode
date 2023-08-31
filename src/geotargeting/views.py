from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import requests


"""
Beim Geo-Targeting werden Templates erstellt. Diese Templates enthalten folgende Optionen:

Geo Tamplate:

Template Name
Land / Gesamtes Land
Region
"""

@login_required(login_url="/login/")
def index_geo_targeting(request):
    return render(request, 'index-geo-targeting-view.html')
    

"""Ruf alle Länder ab"""
def get_country_codes_and_ids():
    username = 'benjaminphilipp'  # Ersetze dies durch deinen eigenen Geonames-Benutzernamen
    base_url = f'http://api.geonames.org/countryInfoJSON?username={username}'
    
    response = requests.get(base_url)
    
    if response.status_code == 200:
        data = response.json()
        countries = data.get('geonames', [])
        return countries
    else:
        print(f"Fehler bei der Anfrage: {response.status_code}")

"""Stelt die länder bereit"""
def country_name(request):
    country_data = get_country_codes_and_ids()
    
    if country_data:
        return JsonResponse(country_data, safe=False)
    else:
        # Handle den Fall, wenn keine Länderdaten gefunden wurden
        return JsonResponse({'message': 'Keine Länderdaten gefunden.'})