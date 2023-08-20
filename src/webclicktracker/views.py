from django.shortcuts import render, HttpResponse, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from bs4 import BeautifulSoup
import re

from .models import WebsiteClick, Link, Button, Website
from accounts.models import CustomUser
from .forms import WebsiteForm

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

# HTML View
def website_click_view(request):
    form = WebsiteForm()
    context = {
        'form': form,
    }
    return render(request, 'click-view.html', context)

# Detaile View Website
def website_detail(request, website_id):
    website = get_object_or_404(Website, id=website_id)
    
    context = {
        'website': website,
    }
    
    return render(request, 'website_detail.html', context)

# List View Website
def website_list(request):
    websites = Website.objects.all()
    website_data = []
    
    for website in websites:
        website_info = {
            'id': website.id,
            'url': website.url,
            'title': website.title,
            'meta_description': website.meta_description,
            'first_image': website.first_image,
            'favicon': website.favicon,
            'created_at': website.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        }
        website_data.append(website_info)
    
    return JsonResponse(website_data, safe=False)

# Crate View Website
@csrf_exempt
def create_website(request):
    if request.method == 'POST':
        
        url = request.POST.get('url')
        user_id = request.POST.get('user_id')
        
        # Überprüfen, ob die URL bereits vorhanden ist
        existing_website = Website.objects.filter(url=url).first()
        
        if existing_website:
            return JsonResponse({'message': 'Url existiert bereits'})
        
        form = WebsiteForm({'url': url})
        
        if form.is_valid():
            website = form.save(commit=False)
            website.user_id = user_id
            
            # Webseite abrufen und analysieren
            response = requests.get(url)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                website.title = soup.title.string if soup.title else None
                website.meta_description = soup.find('meta', attrs={'name': 'description'})['content'] if soup.find('meta', attrs={'name': 'description'}) else None
                
                # Extrahiere die URL des ersten Bildes
                first_image_tag = soup.find('img')
                if first_image_tag:
                    first_image_url = first_image_tag['src']
                    website.first_image = first_image_url
                    
                # Extrahiere die URL des Favicon
                favicon_link = soup.find('link', rel='icon') or soup.find('link', rel='shortcut icon')
                if favicon_link:
                    favicon_url = favicon_link['href']
                    if not re.match(r'^https?://', favicon_url):
                        # Erstelle eine vollständige URL, wenn sie relativ ist
                        parsed_url = urlparse(url)
                        favicon_url = urljoin(f'{parsed_url.scheme}://{parsed_url.netloc}', favicon_url)
                    website.favicon = favicon_url                    
                
                website.save()

                response_data = {
                    'message': 'Webseite angelegt'
                }

                return JsonResponse(response_data)
            else:
                return JsonResponse({'message': 'Fehler beim Abrufen der Webseite'})
        else:
            return JsonResponse({'message': 'Das Formular ist ungültig'})

    return JsonResponse({'message': 'Invalid request method'})




def remove_duplicate_pages():
    # Zähle die Anzahl der Vorkommen jeder URL
    url_counts = WebsiteClick.objects.values('url').annotate(url_count=Count('url'))

    # Erstelle eine leere Liste für doppelte URLs
    duplicate_urls = []

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

        time.sleep(6)
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