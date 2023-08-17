
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

from accounts.models import CustomUser
from .models import ShortcodeClass, Tag
from .forms import ShortcodeClassForm, CreateTagForm
from django.utils import timezone
from analytics.models import ClickEvent
from django.db.models import Count
from bs4 import BeautifulSoup

from django.core.cache import cache


# Suche
def filter_and_search_shortcodes(request):
    query = request.GET.get('q')
    tags = request.GET.getlist('tags[]')  # Mehrere Tags als Liste
    shortcodes = ShortcodeClass.objects.all()

    if tags:
        shortcodes = shortcodes.filter(url_creator=request.user, tags__name__in=tags)

    if query:
        shortcodes = shortcodes.filter(url_creator=request.user, url_titel__icontains=query)

    for shortcode in shortcodes:
        try:
            click_event = ClickEvent.objects.get(short_url=shortcode)
            click_count = click_event.count
        except ClickEvent.DoesNotExist:
            click_count = 0

    data = [{
        'short_id': shortcode.pk,
        'url_titel': shortcode.url_titel,
        'get_short_url': shortcode.get_short_url,
        'url_create_date': shortcode.url_create_date.strftime('%d %b %Y'),
        'click_count': click_count,
        'url_destination': shortcode.url_destination,
        'shortcode': shortcode.shortcode,
        'favicon_path': shortcode.favicon_path,
        } for shortcode in shortcodes]
    return JsonResponse({'shortcodes': data})


#Archive
class ShortcodeArchiveListView(ListView):
    template_name = "archive.html"
    model = ShortcodeClass
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = ShortcodeClassForm()
        context['admin'] = self.request.user.id
        context['useremail'] = self.request.user
        return context
    
    def get_queryset(self):
        current_counters = ShortcodeClass.objects.filter(url_creator=self.request.user.id)
        current_counters = ShortcodeClass.objects.filter(url_archivate=True)
        return current_counters 
    

#Create Shortcode
from django.contrib.auth.decorators import login_required
@login_required(login_url="/login/")
def post_crate_view(request): 
    form = ShortcodeClassForm(data=request.POST)
    if request.is_ajax():
        if form.is_valid():
            form.save()
            cache.delete('json_list_view_cache_key')
            return JsonResponse({'success': 'Dein link wurde erfolgreich erstellt',}, status=200)
        else:
            if form['url_destination'].errors:
                return JsonResponse({'danger_titel': 'Dieses Feld ist zwingend erforderlich.',}, status=200)
        
    return JsonResponse({"error": "Error Test"}, status=400)


#Detaile Update View
@login_required(login_url="/login/")
def post_detaile_data_view(request, pk):
    
    obj = ShortcodeClass.objects.get(pk=pk)
    tags = [tag.id for tag in obj.tags.all()]
    
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
        'tags': tags,
    }
    return JsonResponse({'data':data})


#Archivieren Shortcode
@login_required(login_url="/login/")
def archive_post(request):
    if request.is_ajax():
        pk = request.POST.get('pk')
        obj = ShortcodeClass.objects.get(pk=pk)
        if obj.url_archivate == False:
            obj.url_archivate = True
            obj.save()
        else:
            obj.url_archivate = False
            obj.save()
        return JsonResponse({'count': 'run'})


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
        new_shortcode     = request.POST.get('shortcode_id')
        new_tags        = request.POST.get('tags')

        obj.shortcode = new_shortcode
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
    form = ShortcodeClassForm() 
    tags_form = CreateTagForm()
    context = {
        'form': form,
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

        shortcodes = ShortcodeClass.objects.filter(url_creator=request.user, url_archivate=False)[start_index:end_index]
        
        
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

        # total_shortcodes = ShortcodeClass.objects.count()
        total_shortcodes = ShortcodeClass.objects.filter(url_creator=request.user, url_archivate=True).count()

        return JsonResponse({
            'data': data,
            'total_shortcodes': total_shortcodes,
            'page': page,
            'per_page': per_page,
            'start_index': start_index 
        })


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
                
                # Finde das entsprechende ShortcodeClass-Objekt
                shortcode_instance = ShortcodeClass.objects.get(url_destination=url)
                
                # Speichere die favicon_url im favicon_path-Feld
                shortcode_instance.favicon_path = favicon_url
                shortcode_instance.save()
                
                return JsonResponse({'favicon_url': favicon_url})
            else:
                return JsonResponse({'error': 'Favicon not found'}, status=404)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)
   

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