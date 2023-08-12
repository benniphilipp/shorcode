from django.shortcuts import render
from django.urls import reverse_lazy, reverse
from django.views.generic.list import ListView
from django.http.response import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views import View

from accounts.models import CustomUser
from .models import ShortcodeClass
from .forms import ShortcodeClassForm


#ListView
class ShortcodeClassListView(ListView):
    template_name = "dashboard.html"
    model = ShortcodeClass
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = ShortcodeClassForm()
        context['admin'] = self.request.user.id
        context['useremail'] = self.request.user
        context['sum_archive'] = ShortcodeClass.objects.filter(url_archivate=True).count()
        return context
    
    def get_queryset(self):
        current_counters = ShortcodeClass.objects.filter(url_creator=self.request.user.id)
        current_counters = ShortcodeClass.objects.filter(url_archivate=False)
        return current_counters

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
            return JsonResponse({'success': 'Dein link wurde erfolgreich erstellt',}, status=200)
        else:
            if form['url_destination'].errors:
                return JsonResponse({'danger_titel': 'Dieses Feld ist zwingend erforderlich.',}, status=200)
            # elif form['url_destination'].errors:
            #     print(form['url_destination'].errors)
            #     return JsonResponse({'danger_url': 'Dieses Feld ist zwingend erforderlich oder existiert bereits.',}, status=200)
            # else:
            #     return JsonResponse({'danger': 'Dein link wurde nicht erstellt',}, status=200)
                
        
    return JsonResponse({"error": "Error Test"}, status=400)


#Detaile Update View
@login_required(login_url="/login/")
def post_detaile_data_view(request, pk):
    obj = ShortcodeClass.objects.get(pk=pk)
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
        
        obj.shortcode = new_shortcode
        obj.url_destination = new_destination
        obj.url_titel       = new_titel
        obj.url_source      = new_source
        obj.url_medium      = new_medium
        obj.url_term        = new_term
        obj.url_campaign    = new_campaign
        obj.url_content     = new_content
        obj.save()
        return JsonResponse({'success': 'Dein link wurde erfolgreich geändert',})


# View Shortcode list
@login_required(login_url="/login/")
def shortcode_view(request):
    return render(request, 'shortcode-view.html')

# View Shortcode list Json
class JsonListView(ListView):
    model = ShortcodeClass  # Das Modell, für das du die ListView erstellst
    queryset = ShortcodeClass.objects.all()  # Alle Objekte aus der Datenbank
    content_type = 'application/json'  # Setze den Content-Type auf JSON

    def get_queryset(self):
        # Du kannst diese Methode überschreiben, um die Queryset-Filterung anzupassen
        return self.queryset

    def serialize_shortcodes(self, shortcode_list):
        serialized_shortcodes = []
        for shortcode in shortcode_list:
            serialized_shortcodes.append({
                'url_titel': shortcode.url_titel,
                'get_short_url': shortcode.get_short_url,
                # Füge hier weitere Felder hinzu, die du im JSON-Format anzeigen möchtest
            })
        return serialized_shortcodes

    def render_to_response(self, context, **response_kwargs):
        serialized_data = self.serialize_shortcodes(self.get_queryset())
        return JsonResponse(serialized_data, safe=False, content_type=self.content_type)


#Delete
#https://stackoverflow.com/questions/27625425/django-and-ajax-delete-multiple-items-wth-check-boxes