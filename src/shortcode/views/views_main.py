import requests
from django.db.models import Q
from django.shortcuts import render
from django.urls import reverse_lazy, reverse
from django.views.generic.list import ListView
from django.http.response import JsonResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.views import View
import csv
from django.http import HttpResponse
from datetime import timedelta, date, datetime
from django.core.serializers import serialize

from accounts.models import CustomUser
from geotargeting.models import GeoThemplate
from shortcode.models import ShortcodeClass, Tag
from shortcode.forms import ShortcodeClassForm, CreateTagForm, LimitationShorcodeForm, GeoTargetingForm, AndroidTargetingForm, IosTargetingForm
from django.utils import timezone
from analytics.models import ClickEvent, DailyClick, IPGeolocation
from django.db.models import Count
from bs4 import BeautifulSoup

from django.core.cache import cache

from django.db.models import F



'''
@Todo
    - 1. Eingebaute A/B-Test-Funktionen könnten es Nutzern ermöglichen, verschiedene Versionen desselben Links zu erstellen und zu testen, um herauszufinden, welche besser abschneidet.
    - 2. Die Möglichkeit, verschiedene Ziel-URLs für verschiedene Zielgruppen festzulegen, könnte es Nutzern ermöglichen, personalisierte Inhalte an verschiedene Empfänger zu senden.
    - 3. Qr-Code für den link als dowload png, svg und jpg
    - 4. Ablaufdatum des links danach gibt es eine Alternative
    - 5. Tags Ansicht anpassen nebeinander
'''

# Suche
@login_required(login_url="/login/")
def filter_and_search_shortcodes(request):
    query = request.GET.get('q')
    tags = request.GET.getlist('tags[]')  # Mehrere Tags als Liste
    shortcodes = ShortcodeClass.objects.all()

    if tags:
        shortcodes = shortcodes.filter(url_creator=request.user, tags__name__in=tags)

    if query:
        shortcodes = shortcodes.filter(url_creator=request.user, url_titel__icontains=query)

    data = []
    
    for shortcode in shortcodes:
        try:
            click_event = ClickEvent.objects.get(short_url=shortcode)
            click_count = click_event.count
        except ClickEvent.DoesNotExist:
            click_count = 0

        # Holen Sie die Tags für diesen Shortcode
        shortcode_tags = shortcode.tags.all()
        tag_names = [tag.name for tag in shortcode_tags]

        data.append({
            'short_id': shortcode.pk,
            'url_titel': shortcode.url_titel,
            'get_short_url': shortcode.get_short_url,
            'url_create_date': shortcode.url_create_date.strftime('%d %b %Y'),
            'click_count': click_count,
            'url_destination': shortcode.url_destination,
            'shortcode': shortcode.shortcode,
            'favicon_path': shortcode.favicon_path,
            'tags': tag_names,  # Fügen Sie die Tag-Namen hinzu
        })

    return JsonResponse({'shortcodes': data})


#Archive liste view
class ShortcodeArchiveListView(ListView):
    template_name = "archive.html"
    model = ShortcodeClass
    context_object_name = 'current_counters'
    
    def get_queryset(self):
        return ShortcodeClass.objects.filter(url_creator=self.request.user, url_archivate=True)


class GetArchivedShortcodesView(View):
    def get(self, request):
        # Holen Sie die archivierten Shortcodes des aktuellen Benutzers
        archived_shortcodes = ShortcodeClass.objects.filter(url_creator=request.user, url_archivate=True)

        # Erstellen Sie eine Liste von Shortcode-Daten im JSON-Format
        shortcode_data = [{'id': shortcode.id, 
                           'url_titel': shortcode.url_titel, 
                           'url_destination':shortcode.url_destination, 
                           'url_create_date':shortcode.url_create_date} for shortcode in archived_shortcodes]

        return JsonResponse({'archived_shortcodes': shortcode_data})

#Archivieren Shortcode
@login_required(login_url="/login/")
def archive_post(request):
    if request.is_ajax():
        pk = request.POST.get('pk')
        print(pk)
        obj = ShortcodeClass.objects.get(pk=pk)
        if obj.url_archivate == False:
            obj.url_archivate = True
            obj.save()
        else:
            obj.url_archivate = False
            obj.save()
        return JsonResponse({'count': 'Shortcodes wurden erfolgreich Archiviert.'})  

#Archiviert aufehben
def unarchive_selected_shortcodes(request):
    if request.method == 'POST':
        # Nehmen Sie die ausgewählten Shortcode-IDs aus dem POST-Daten
        selected_shortcodes = request.POST.getlist('selected_shortcodes[]')

        # Überprüfen Sie, ob der Benutzer berechtigt ist, diese Shortcodes zu bearbeiten,
        # indem Sie sicherstellen, dass die ausgewählten Shortcodes tatsächlich dem aktuellen Benutzer gehören.

        # Führen Sie die Entarchivierung für die ausgewählten Shortcodes durch
        for shortcode_id in selected_shortcodes:
            try:
                shortcode = ShortcodeClass.objects.get(pk=shortcode_id, url_creator=request.user)
                shortcode.url_archivate = False
                shortcode.save()
            except ShortcodeClass.DoesNotExist:
                # Handle den Fall, wenn der Shortcode nicht existiert oder nicht dem Benutzer gehört
                pass

        # Hier können Sie eine Erfolgsmeldung oder eine JSON-Antwort mit Informationen zurückgeben
        response_data = {'message': 'Die ausgewählten Shortcodes wurden erfolgreich entarchiviert.'}
        return JsonResponse(response_data)


#Create Shortcode
@login_required(login_url="/login/")
def post_crate_view(request): 
    form = ShortcodeClassForm(data=request.POST)
    if request.is_ajax():
        if form.is_valid():
            form.save()
            cache.delete('json_list_view_cache_key')
            return JsonResponse({'success': 'Dein link wurde erfolgreich erstellt.',}, status=200)
        else:
            errors = form.errors
            error_messages = {}

            # Überprüfe spezifische Felder und füge entsprechende Fehlermeldungen hinzu
            if 'url_destination' in errors:
                error_messages['url_destination'] = errors['url_destination'][0]
            if 'url_titel' in errors:
                error_messages['url_titel'] = errors['url_titel'][0]

            return JsonResponse({'errors': error_messages}, status=200)
        
    return JsonResponse({"error": "Error Test"}, status=400)


#Detaile Update View
@login_required(login_url="/login/")
def post_detaile_data_view(request, pk):
    
    obj = ShortcodeClass.objects.get(pk=pk)
    
    
    # Tags User
    # user = request.user
    # user_tags = Tag.objects.filter(user=user)
    # shortcode_tags = user_tags.filter(shortcodes=obj)
    tags = [tag.id for tag in obj.tags.all()]
    
    template_geo_id = [geo.id for geo in obj.template_geo.all()]
    
    data = {
        'id': obj.pk,
        'url_destination': obj.url_destination,
        'url_titel': obj.url_titel,
        'url_source': obj.url_source,
        'url_medium': obj.url_medium,
        'url_campaign': obj.url_campaign,
        'url_term': obj.url_term,
        'url_active': obj.url_active,
        'url_archivate': obj.url_archivate,
        'url_content': obj.url_content,
        'shortcode': obj.shortcode,
        'get_short_url': obj.get_short_url,
        'tags': tags, #list(tag_ids),
        'url_id_count': obj.count,
        'url_id_end_date': obj.start_date,
        'url_id_start_date': obj.end_date,
        'url_id_alternative_url': obj.alternative_url,
        'url_id_link_geo': obj.link_geo,
        'url_id_template_geo': template_geo_id,
        'geo_targeting_on_off': obj.geo_targeting_on_off,
        'android_on_off': obj.android_on_off,
        'url_id_android': obj.android,
        'url_id_ios': obj.ios,
        'ios_on_off': obj.ios_on_off
    }
    return JsonResponse({'data':data})




#Update Shortcode
@login_required(login_url="/login/")
def update_post(request, pk):
    obj = ShortcodeClass.objects.get(pk=pk)
    if request.is_ajax():
        new_destination = request.POST.get('url_destination')
        new_titel       = request.POST.get('url_titel')
        new_source      = request.POST.get('url_source')
        new_medium      = request.POST.get('url_medium')
        new_term        = request.POST.get('url_term')
        new_campaign    = request.POST.get('url_campaign')
        new_content     = request.POST.get('url_content')
        new_shortcode   = request.POST.get('shortcode_id')
        new_tags        = request.POST.get('tags')

        obj.shortcode       = new_shortcode
        obj.url_destination = new_destination
        obj.url_titel       = new_titel
        obj.url_source      = new_source
        obj.url_medium      = new_medium
        obj.url_term        = new_term
        obj.url_campaign    = new_campaign
        obj.url_content     = new_content
        
        if new_tags:
            tag_ids = [int(tag_id) for tag_id in new_tags.split(',')]  # Konvertiere die Tag-IDs in eine Liste von Integers
            obj.tags.set(tag_ids)
        
        
        cache.delete('json_list_view_cache_key')
        obj.save()
        return JsonResponse({'success': 'Dein link wurde erfolgreich geändert',})


# View Shortcode list
@login_required(login_url="/login/")
def shortcode_view(request):
    form = ShortcodeClassForm(request.POST or None, user=request.user) 
    tags_form = CreateTagForm()
    limitation_form = LimitationShorcodeForm()
    geo_targeting_form = GeoTargetingForm()
    android_targetingform = AndroidTargetingForm()
    ios_targetingform = IosTargetingForm()
    context = {
        'form': form,
        'geo_targeting_form': geo_targeting_form,
        'android_targetingform': android_targetingform,
        'ios_targetingform': ios_targetingform,
        'limitation_form': limitation_form,
        'tags_form': tags_form,
        'admin': request.user.id,
        'useremail': request.user
    }
    return render(request, 'shortcode-view.html', context)



# View Shortcode list Json        
def load_shortcode_data_view(request):
    if request.is_ajax():
        page = int(request.GET.get('page', 1))
        per_page = 5  # Anzahl der Einträge pro Seite
        
        start_index = (page - 1) * per_page
        end_index = start_index + per_page

        shortcodes = ShortcodeClass.objects.filter(url_creator=request.user, url_archivate=False) \
                                          .order_by('-url_create_date')[start_index:end_index]
        
        data = []  
        for shortcode in shortcodes:
            try:
                click_event = ClickEvent.objects.get(short_url=shortcode)
                click_count = click_event.count
            except ClickEvent.DoesNotExist:
                click_count = 0
                
            tags = [tag.name for tag in shortcode.tags.all()]
            item = {
                'short_id': shortcode.pk,
                'url_titel': shortcode.url_titel,
                'get_short_url': shortcode.get_short_url,
                'url_create_date': shortcode.url_create_date.strftime('%d %b %Y'),
                'click_count': click_count,
                'url_destination': shortcode.url_destination,
                'shortcode': shortcode.shortcode,
                'favicon_path': shortcode.favicon_path,
                'tags': tags
            }
            data.append(item)


        total_shortcodes = ShortcodeClass.objects.filter(url_creator=request.user, url_archivate=False).count()

        return JsonResponse({
            'data': data,
            'total_shortcodes': total_shortcodes,
            'page': page,
            'per_page': per_page,
            'start_index': start_index 
        })


# Holt das Favicon
class GetFaviconView(View):
    def get(self, request):
        url = request.GET.get('url')  # Die URL der fremden Website
        try:
            response = requests.get(url)
            content = response.content
            soup = BeautifulSoup(content, 'html.parser')
            favicon_link = soup.find('link', rel='icon')
            
            if favicon_link:
                favicon_url = favicon_link.get('href')
                if not favicon_url.startswith('http'):
                    # Handle relative URLs
                    base_url = url.split('/')[2]
                    favicon_url = f'http://{base_url}/{favicon_url}'
                
                # Finde alle entsprechenden ShortcodeClass-Objekte
                shortcode_instances = ShortcodeClass.objects.filter(url_destination=url)
                
                # Speichere die favicon_url im favicon_path-Feld für alle Einträge
                for shortcode_instance in shortcode_instances:
                    shortcode_instance.favicon_path = favicon_url
                    shortcode_instance.save()
                
                return JsonResponse({'favicon_url': favicon_url})
            else:
                return JsonResponse({'error': 'Favicon not found'}, status=404)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)


class DeleteShortcodesView(View):
    def post(self, request):
        if request.is_ajax():
            shortcode_ids = request.POST.getlist('shortcode_ids[]')

            try:
                # Lösche die ausgewählten Shortcodes aus der Datenbank
                ShortcodeClass.objects.filter(pk__in=shortcode_ids).delete()
                message = 'Shortcodes wurden erfolgreich gelöscht.'
            except Exception as e:
                message = 'Fehler beim Löschen der Shortcodes: ' + str(e)

            return JsonResponse({'message': message})
        else:
            return JsonResponse({'error': 'Ungültige Anfrage'})
   

# Export Shortcode
def export_shortcodes_to_excel(request):
    if request.method == 'POST':
        selected_ids = request.POST.getlist('selected_ids[]')
        selected_shortcodes = [int(id_str.split('_')[-1]) for id_str in selected_ids]

        # Erzeuge die HTTPResponse mit der CSV-Inhalt
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=shortcodes.csv'

        # Erstelle einen CSV-Writer und schreibe die Header-Zeile
        writer = csv.writer(response)
        writer.writerow(['ID', 'URL Titel', 'Aktiviert', 'Shortcode', 'Utm'])

        # Füge ausgewählte Shortcodes-Daten hinzu
        for shortcode_id in selected_shortcodes:
            shortcode = ShortcodeClass.objects.get(pk=shortcode_id)
            row = [shortcode.id, shortcode.url_titel, shortcode.get_short_url, shortcode.url_active, shortcode.get_full_url]
            writer.writerow(row)

        return response


# Create Tag
class CreateTagView(View):
    def post(self, request, *args, **kwargs):

        tag_name = request.POST.get('tag_name')
        user_id = request.user.id
        
        tag, created = Tag.objects.get_or_create(user_id=user_id, name=tag_name)
        if created:
            return JsonResponse({'message': f'Tag "{tag_name}" wurde erstellt.'}, status=201)
        else:
            return JsonResponse({'message': f'Tag "{tag_name}" existiert bereits.'}, status=400)


#View Tags
def get_all_tags(request):
    tags = Tag.objects.filter(user=request.user).values_list('name', flat=True)
    return JsonResponse({'tags': list(tags)})


# Viwe
class TagDeleteView(View):
    def post(self, request, tag_id):
        tag = get_object_or_404(Tag, id=tag_id)
        tag.delete()
        return JsonResponse({'message': 'Tag deleted successfully'})


class TagListView(View):
    def get(self, request):
        tags = Tag.objects.filter(user=request.user)
        data = [{'id': tag.id, 'name': tag.name} for tag in tags]
        return JsonResponse({'tags': data})

# View Tag Edit
def edit_tag(request, tag_id):
    if request.method == 'POST':
        tag = get_object_or_404(Tag, id=tag_id)
        new_tag_name = request.POST.get('tag_name')
  
        tag.name = new_tag_name
        tag.save()

        return JsonResponse({'message': 'Tag updated successfully.'})
    
#Delete
#https://stackoverflow.com/questions/27625425/django-and-ajax-delete-multiple-items-wth-check-boxes