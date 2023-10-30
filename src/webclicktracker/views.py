from django.shortcuts import render, HttpResponse, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from bs4 import BeautifulSoup
import re

from .models import WebsitePages, Link, Button, Website, Subpage
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
- 1. Ich muss ihr noch die Nachriten an Ajax übergben.
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



# Prüfung https
def add_default_scheme(url):
    if isinstance(url, tuple):
        url = url[0]  
    parsed_url = urlparse(url)
    if not parsed_url.scheme:
        url = "http://" + url
    return url



# Schritt 1: alle Header links holen
def save_header_links(url):
    response = requests.get(url, verify=False)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        # Finde den header-Tag
        header = soup.find('header')
        if header:
            header_links = header.find_all('a')
            cleaned_links = set()  # Hier verwenden wir ein Set, um Duplikate zu vermeiden
            for link in header_links:
                link_url = link.get('href')
                if link_url:
                    full_link_url = urljoin(url, link_url)
                    parsed_url = urlparse(full_link_url)
                    if parsed_url.scheme not in ('tel', 'mailto') and parsed_url.netloc == urlparse(url).netloc:
                        # Füge den Link der bereinigten URL hinzu
                        cleaned_links.add(full_link_url)
            return cleaned_links      



#  Schritt 2: Links holen
def links_pages_crawler(header_links):
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
    
    #print("Links fertig")
    return all_links


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
    
    #print("Buttons fertig")    
    return all_buttons


#Speichert Buttonts
def save_buttons_to_page(website_page, buttons_list):
    saved_classes = set()
    saved_ids = set()
    
    for button_data in buttons_list:
        button_text = button_data['button_text']
        button_id = button_data['button_id']
        button_class = button_data['button_class']
        
        # Prüfe, ob die Klasse bereits gespeichert wurde
        if button_class and button_class not in saved_classes:
            Button.objects.create(website_click=website_page, button_text=button_text, button_class=button_class)
            saved_classes.add(button_class)
        
        # Prüfe, ob die ID bereits gespeichert wurde
        if button_id and button_id not in saved_ids:
            Button.objects.create(website_click=website_page, button_text=button_text, button_id=button_id)
            saved_ids.add(button_id)


# holt Breadcrume 
def find_breadcrumbs(page_url):
    # print(f"Searching breadcrumbs on page: {page_url}")
    page_url = add_default_scheme(page_url)
    breadcrumbs_links = set()  # Hier verwenden wir ein Set
    
    response = requests.get(page_url, verify=False)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        breadcrumbs_classes = ["woocommerce-breadcrumb", "breadcrumbs", "breadcrumb", "crumbs", "trail"]
        breadcrumbs_ids = ["woocommerce-breadcrumb", "breadcrumbs", "breadcrumb", "crumbs", "trail"]
        
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

    
# Funktion zum Holen des aktuellen Titels einer Webseite
def get_current_page_title(url):
    response = requests.get(url, verify=False)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        title_tag = soup.find('title')
        if title_tag:
            return title_tag.get_text()
    return None
    
     
# # Funktion zum Erstellen und Speichern von WebsitePages mit Titeln
def create_website_page_with_title(url, title, website_instance, user):
    # Normalize the URL by removing trailing slashes
    normalized_url = url.rstrip('/')
    
    # Check if the normalized URL already exists
    existing_page = WebsitePages.objects.filter(url=normalized_url).first()
    if existing_page:
        return existing_page
    
    website_page = WebsitePages.objects.create(url=normalized_url, title=title, website=website_instance, user=user)
    return website_page


def is_subpage(url):
    return '/' in url and url.count('/') > 2


# Funktion zum Speichern einer Seite
def save_page(url, title, website_instance, user):
    page = WebsitePages.objects.create(url=url, title=title, website=website_instance, user=user)
    # print(f'WebsitePages Save: {page}')
    return page


# # Funktion zum Speichern von Unterseiten
def save_subpage(url, title, parent_page):
    subpage = Subpage.objects.create(url=url, title=title, parent_page=parent_page)
    # print(f'Subpage Save: {subpage}')
    return subpage

def get_hierarchy_level(url):
    parsed_url = urlparse(url)
    path_segments = parsed_url.path.split('/')
    non_empty_segments = [segment for segment in path_segments if segment]
    return len(non_empty_segments)


def save_website_click_recursive(url, user, website_instance, visited_links=None):
    
    if visited_links is None:
        visited_links = set()

    # Holen des aktuellen Seitentitels
    

    # Heade links holen
    header_links = save_header_links(url)
    
    
    # Links holen        
    for header_item in header_links:        
        # Erstelle und speichere eine WebsitePages-Instanz mit den Links aus dem Header mit Titel
        
        current_page_title = get_current_page_title(header_item)
        website_page_instance = create_website_page_with_title(url=header_item, title=current_page_title, website_instance=website_instance, user=user)
        
        if header_item not in visited_links:
            visited_links.add(header_item)            
            # Beispiel: Die Seite besuchen und Links sammeln
            all_links_on_page = links_pages_crawler(header_item)
            
            '''Ich brauch noch eine funktion die Header links mit einen Extra Tag oder in ein Module Speichert.'''
    
            for link_data in all_links_on_page:
                link_url, link_id, link_class = link_data

                # Überprüfe, ob der Link nicht im Header vorhanden war, bevor du ihn speicherst
                if link_url not in header_links:
                    
                    # Hier links Header Speichern
                    Link.objects.create(website_click=website_page_instance, link=link_url, link_id=link_id, link_class=link_class)
                    linked_websites = WebsitePages.objects.filter(url=link_url)
                    
                    # Überprüfe, ob die verlinkte Seite bereits gespeichert ist
                    try:
                        linked_websites = WebsitePages.objects.get(url=link_url)
                    except WebsitePages.DoesNotExist:
                        linked_websites = None
                            
                    linked_websites = WebsitePages.objects.filter(url=link_url)  # Hier korrigiert
                    # Falls die Seite nicht gespeichert ist, rufe die Funktion rekursiv auf
                    if not linked_websites.exists():
                        linked_websites = create_website_page_with_title(link_url, current_page_title, website_instance, user)  # Hier korrigiert
                    else:
                        linked_websites = linked_websites.first()
                        
                        
                    buttons_list = save_buttons_on_pages(link_url)
        
                    saved_classes = set()
                    saved_ids = set()
                    
                    for button_data in buttons_list:
                        button_text = button_data['button_text']
                        button_id = button_data['button_id']
                        button_class = button_data['button_class']
                        
                        # Prüfe, ob die Klasse bereits gespeichert wurde
                        if button_class and button_class not in saved_classes:
                            Button.objects.create(website_click=website_page_instance, button_text=button_text, button_class=button_class)
                            saved_classes.add(button_class)
                        
                        # Prüfe, ob die ID bereits gespeichert wurde
                        if button_id and button_id not in saved_ids:
                            Button.objects.create(website_click=website_page_instance, button_text=button_text, button_id=button_id)
                            saved_ids.add(button_id)
                        
                        
            
                breadcrumbs_links = find_breadcrumbs(link_url)
                
                for breadcrumb_link in breadcrumbs_links:
                    # Überprüfe auf leere Werte, bevor du den Link hinzufügst
                    if breadcrumb_link:
                        # Breadcrumb-Link zu speichern
                        linked_websites = WebsitePages.objects.filter(url=breadcrumb_link)
                        
                        # Überprüfe, ob die verlinkte Seite bereits gespeichert ist
                        if not linked_websites.exists():
                            linked_websites = create_website_page_with_title(breadcrumb_link, current_page_title, website_instance, user)
                        else:
                            linked_websites = linked_websites.first()
                        
                        # print(f'Breadcrumb-Link gespeichert: {breadcrumb_link}')




# Start Website crawler
@csrf_exempt
def save_click_view(request):
    if request.method == 'POST' and request.is_ajax():
        url = request.POST.get('url')
        user = request.user

        try:
            website_instance = Website.objects.get(url=url)  # Hole die vorhandene Website-Instanz
            save_website_click_recursive(url, user, website_instance)  # Übergebe die Website-Instanz
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
        'pages': []  # Änderung: 'clicks' in 'pages' umbenannt
    }
    
    website_pages = WebsitePages.objects.filter(website=website)  # Alle Seiten für die Website

    for page in website_pages:
        page_data = {
            'id': page.id,
            'url': page.url,
            'title': page.title,
            'user_id': page.user_id,
        }

        website_data['pages'].append(page_data)


    return JsonResponse(website_data)






