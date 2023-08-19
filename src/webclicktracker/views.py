from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import WebsiteClick, Link, Button
from urllib.parse import urljoin, urlparse
from collections import defaultdict
from django.db.models import Count
from django.http import JsonResponse, HttpRequest
import time
from tqdm import tqdm

from bs4 import BeautifulSoup
import requests
import json

'''
Ich muss ihr noch die Nachriten an Ajax übergben.
'''

def website_click_view(request):
    return render(request, 'click-view.html')



def remove_duplicate_pages():
    # Zähle die Anzahl der Vorkommen jeder URL
    url_counts = WebsiteClick.objects.values('url').annotate(url_count=Count('url'))

    # Erstelle eine leere Liste für doppelte URLs
    duplicate_urls = []

    # Durchlaufe die URLs und speichere die doppelten URLs
    for entry in url_counts:
        if entry['url_count'] > 1:
            duplicate_urls.append(entry['url'])

    # Durchlaufe die doppelten URLs und behalte den neuesten Eintrag
    for url in duplicate_urls:
        duplicate_entries = WebsiteClick.objects.filter(url=url).order_by('-created_at')[1:]
        for entry in duplicate_entries:
            entry.delete()


def remove_duplicates_view(request):
    remove_duplicate_pages()  # Die Funktion zum Entfernen doppelter Seiten aufrufen
    
    response_data = {
        'message': 'Doppelte Seiten wurden entfernt.'
    }
    
    return JsonResponse(response_data)



def save_website_click_recursive(url, user, parent_path=None, depth=0, max_depth=2, base_url=None):
    if base_url is None:
        base_url = url  # Setze die ursprüngliche URL als Basis-URL

    response = requests.get(url, verify=False)  # Deaktivierung der SSL-Zertifikatsüberprüfung
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string if soup.title else "Untitled"
        url_path = url  # Initialisiere den URL-Pfad mit der aktuellen URL

        time.sleep(5)
        if parent_path:
            url_path = f"{parent_path} > {url_path}"  # Füge den aktuellen Pfad hinzu

        # Überprüfen Sie, ob eine WebsiteClick-Instanz mit dem gleichen Titel und derselben URL existiert
        existing_click = WebsiteClick.objects.filter(title=title, url=url).first()
        if not existing_click:
            # Wenn keine Instanz gefunden wurde, erstellen Sie eine neue
            website_click = WebsiteClick.objects.create(url=url, click_path=url_path, title=title, user=user)

            if depth < max_depth:
                for link in soup.find_all('a'):
                    link_url = link.get('href')
                    if link_url:
                        full_link_url = urljoin(url, link_url)
                        parsed_url = urlparse(full_link_url)
                        if parsed_url.scheme not in ('tel', 'mailto') and parsed_url.netloc == urlparse(base_url).netloc:
                            save_website_click_recursive(full_link_url, user, parent_path=url_path, depth=depth + 1, max_depth=max_depth, base_url=base_url)
                            time.sleep(1)

                for button in soup.find_all('button'):
                    button_text = button.text
                    button_id = button.get('id')
                    button_class = ' '.join(button.get('class', []))
                    Button.objects.create(website_click=website_click, button_text=button_text, button_id=button_id, button_class=button_class)

                for nav_link in soup.find_all('a'):
                    nav_link_url = nav_link.get('href')
                    if nav_link_url:
                        full_nav_link_url = urljoin(url, nav_link_url)
                        parsed_nav_link_url = urlparse(full_nav_link_url)
                        if parsed_nav_link_url.scheme not in ('tel', 'mailto') and parsed_nav_link_url.netloc == urlparse(base_url).netloc:
                            nav_link_id = nav_link.get('id')
                            nav_link_class = ' '.join(nav_link.get('class', []))
                            existing_link = Link.objects.filter(link=full_nav_link_url).first()
                            if not existing_link:
                                Link.objects.create(website_click=website_click, link=full_nav_link_url, link_id=nav_link_id, link_class=nav_link_class)
                            time.sleep(1)
                    

def save_click_view(request: HttpRequest):
    if request.method == 'POST' and request.is_ajax():
        url = request.POST.get('url')
        user = request.user  # Hier den eingeloggten Benutzer abrufen
        
        # Hier startet die rekursive Website-Analyse
        save_website_click_recursive(url, user)  # Korrekte Argumente hinzugefügt
        
        response_data = {
            'message': 'Analyse gestartet'
        }

        return JsonResponse(response_data)

    return JsonResponse({'message': 'Fehler: Ungültige Anfrage'})