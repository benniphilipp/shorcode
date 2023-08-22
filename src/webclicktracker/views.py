from django.shortcuts import render, HttpResponse, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from bs4 import BeautifulSoup
import re

from .models import WebsitePages, Link, Button, Website
from accounts.models import CustomUser
from .forms import WebsiteForm

from collections import defaultdict
from django.db.models import Count
from django.http import JsonResponse, HttpRequest
import time
from tqdm import tqdm

from bs4 import BeautifulSoup
import requests
import json

from urllib.parse import urljoin, urlparse, urlunparse

'''
@ToDo
-    Ich muss ihr noch die Nachriten an Ajax übergben.
- 1. Die Website die angezeit werden sollen dafür benutz werden, das man schenll Kurze links erstteln kann.
- 2. Die Website soll sauber crawler werden.
- 3. Danch sollen die Daten die der Trecking Code oder das Plugin aufnimmt an die Passenen Page und und an die Links und Buttons übergeben werden.
- 4. Prüfung der Websiten links ob noch erreichbar, über Selery.
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



# Websiten reinigung
def remove_duplicate_pages():
    # Zähle die Anzahl der Vorkommen jeder URL
    url_counts = WebsitePages.objects.values('url').annotate(url_count=Count('url'))

    # Erstelle eine leere Liste für doppelte URLs
    duplicate_urls = []

    for entry in url_counts:
        if entry['url_count'] > 1:
            duplicate_urls.append(entry['url'])

    # Durchlaufe die doppelten URLs und behalte den neuesten Eintrag
    for url in duplicate_urls:
        duplicate_entries = WebsitePages.objects.filter(url=url).order_by('-created_at')[1:]
        for entry in duplicate_entries:
            entry.delete()


def remove_duplicates_view(request):
    remove_duplicate_pages()  # Die Funktion zum Entfernen doppelter Seiten aufrufen
    
    response_data = {
        'message': 'Doppelte Seiten wurden entfernt.'
    }
    
    return JsonResponse(response_data)




def add_default_scheme(url):
    if isinstance(url, tuple):
        url = url[0]  # Nehme den ersten Eintrag aus der Tuple
    parsed_url = urlparse(url)
    if not parsed_url.scheme:
        url = "http://" + url  # Füge Standard-Schema hinzu
    return url


# Schritt 1: Website aufrufen und Daten extrahieren
def fetch_website_data(url):
    response = requests.get(url, verify=False)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string if soup.title else "Untitled"
        return title, soup
    return None, None

# Schritt 2: Website Titel holen
def save_page_titles(cleaned_links):
    cleaned_links = [add_default_scheme(link) for link in cleaned_links]
    
    page_titles = {}
    
    for page_url in cleaned_links:
        response = requests.get(page_url, verify=False)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            title = soup.title.string if soup.title else "Untitled"
            page_titles[page_url] = title
    
    return page_titles


#  Schritt 3: Buttons holen
def save_buttons_on_pages(full_link_url):
    full_link_url = add_default_scheme(full_link_url)
    all_buttons = []

    response = requests.get(full_link_url, verify=False)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        buttons_seen = set()  # Hier speichern wir die gesehenen Klassen der Buttons auf der Seite
        buttons = soup.find_all('button')
        
        for button in buttons:
            button_class = ' '.join(button.get('class', []))
            if button_class not in buttons_seen:
                buttons_seen.add(button_class)
                
                button_text = button.text
                button_id = button.get('id')
                all_buttons.append({'button_text': button_text, 'button_id': button_id, 'button_class': button_class})
    
    print("Buttons fertig")    
    return all_buttons

#  Schritt 4: Links holen
def save_links_on_pages(header_links):
    header_links = add_default_scheme(header_links)
    all_links = set()

    response = requests.get(header_links, verify=False)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        a_links = soup.find_all('a')
        for a_link in a_links:
            link_url = a_link.get('href')
            link_id = a_link.get('id')
            link_class = ' '.join(a_link.get('class', []))
            
            if link_url:
                full_link_url = urljoin(header_links, link_url)
                parsed_url = urlparse(full_link_url)
                
                if parsed_url.scheme not in ('tel', 'mailto') and parsed_url.netloc == urlparse(header_links).netloc:
                    all_links.add((full_link_url, link_id, link_class))
    
    print("Links fertig")
    return all_links



def save_header_links(url):
    response = requests.get(url, verify=False)  

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Finde den header-Tag
        header = soup.find('header')
        if header:

            header_links = header.find_all('a')
            cleaned_links = set()
            for link in header_links:
                link_url = link.get('href')
                if link_url:
                    full_link_url = urljoin(url, link_url)
                    parsed_url = urlparse(full_link_url)
                    if parsed_url.scheme not in ('tel', 'mailto') and parsed_url.netloc == urlparse(url).netloc:
                        
                        # Füge den Link der bereinigten URL hinzu
                        cleaned_links.add(full_link_url)
            return cleaned_links       



def find_breadcrumbs(page_url):
    page_url = add_default_scheme(page_url)
    breadcrumbs_links = set()  # Hier verwenden wir ein Set

    response = requests.get(page_url, verify=False)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        breadcrumbs_classes = ["breadcrumbs", "breadcrumb", "crumbs", "trail"]
        breadcrumbs_ids = ["breadcrumbs", "breadcrumb", "crumbs", "trail"]
        
        for class_name in breadcrumbs_classes:
            elements_with_class = soup.find_all(class_=class_name)
            for element in elements_with_class:
                links = element.find_all('a')
                for link in links:
                    link_url = link.get('href')
                    breadcrumbs_links.add(link_url)  # Hinzufügen zum Set
                
        for id_name in breadcrumbs_ids:
            element_with_id = soup.find(id=id_name)
            if element_with_id:
                links = element_with_id.find_all('a')
                for link in links:
                    link_url = link.get('href')
                    breadcrumbs_links.add(link_url)  # Hinzufügen zum Set
    
    return breadcrumbs_links

     

# Rekursive Funktion zum Speichern von Website-Daten
def save_website_click_recursive(url, user, website):
    header_links = save_header_links(url)  # Rufe die Funktion auf, um die Links zu erhalten

    non_header_links = set() 
    collected_links = set()
            
    page_titles = save_page_titles(header_links) 
    for page_url, title in page_titles.items():
        website_page = WebsitePages.objects.create(url=page_url, title=title, website=website, user=user)
        print(f'WebsitePages Save: {website_page}')
        
        collected_links.add(page_url)
        

        links_on_page = save_links_on_pages(page_url) 
        non_header_links.update(links_on_page) 

    for page_url, link_id, link_class in non_header_links:
        link_id = link_id if link_id else ""
        link_class = link_class if link_class else ""
        full_link_url = urljoin(page_url, link_id + link_class)
        links_on_page = save_links_on_pages(full_link_url)  # Übergebe das 'user'-Argument
        for link_url in links_on_page:
            Link.objects.create(website_click=website_page, link=link_url, link_id=link_id, link_class=link_class)

    print("Links wurden erfolgreich gespeichert.")

    buttons_on_page = save_buttons_on_pages(full_link_url)  # Übergebe das 'user'-Argument
    for button_info in buttons_on_page:
        button = Button.objects.create(website_click=website_page, **button_info)
        print(f'Button: {button}')
    
    print("Buttons wurden erfolgreich gespeichert.")

    for page_url, breadcrumb_id, breadcrumb_class in non_header_links:
        breadcrumbs = find_breadcrumbs(page_url)
        link_id = breadcrumb_id if breadcrumb_id else None
        link_class = breadcrumb_class if breadcrumb_class else None
        Link.objects.create(website_click=website_page, link=breadcrumbs, link_id=link_id, link_class=link_class)
    
    print("Breadcrumbs wurden erfolgreich gespeichert.")


# Start Website crawler
@csrf_exempt
def save_click_view(request):
    if request.method == 'POST' and request.is_ajax():
        url = request.POST.get('url')
        user = request.user

        try:
            website = Website.objects.get(url=url)  # Hole die vorhandene Website-Instanz
            save_website_click_recursive(url, user, website)  # Übergebe die Website-Instanz
            response_data = {
                'message': 'Analyse gestartet'
            }
        except Website.DoesNotExist:
            response_data = {
                'error': 'Website-Datensatz existiert nicht'
            }

        return JsonResponse(response_data)

    return JsonResponse({'message': 'Fehler: Ungültige Anfrage'})


# GoJS
def website_data_json(request, website_id):
    try:
        website = Website.objects.get(id=website_id)
    except Website.DoesNotExist:
        return JsonResponse({'error': 'Website not found'}, status=404)

    website_data = {
        'id': website.id,
        'url': website.url,
        'title': website.title,
        'favicon': website.favicon,
        'first_image': website.first_image,
        'meta_description': website.meta_description,
        'user_id': website.user_id,
        'clicks': []
    }

    website_clicks = WebsitePages.objects.filter(website=website)  # Änderung: Filtere nach der Website
    for click in website_clicks:
        click_data = {
            'id': click.id,
            'click_path': click.url,
            'title': click.title,
            'user_id': click.user_id,
            'links': [],
            'buttons': []
        }

        links = Link.objects.filter(website_click=click)
        for link in links:
            link_data = {
                'link': link.link,
                'link_id': link.link_id,
                'link_class': link.link_class
            }
            click_data['links'].append(link_data)

        buttons = Button.objects.filter(website_click=click)
        for button in buttons:
            button_data = {
                'button_text': button.button_text,
                'button_id': button.button_id,
                'button_class': button.button_class
            }
            click_data['buttons'].append(button_data)

        website_data['clicks'].append(click_data)
        
    website_data['clicks'] = sorted(website_data['clicks'], key=lambda x: x['click_path'])
    return JsonResponse(website_data)
