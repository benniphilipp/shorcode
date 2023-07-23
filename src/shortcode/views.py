from django.shortcuts import render
from django.urls import reverse_lazy, reverse
from django.views.generic.list import ListView
from django.http.response import JsonResponse

from accounts.models import CustomUser
from .models import ShortcodeClass
from .forms import ShortcodeClassForm

class ShortcodeClassListView(ListView):
    template_name = "dashboard.html"
    model = ShortcodeClass
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = ShortcodeClassForm()
        context['admin'] = self.request.user.id
        context['useremail'] = self.request.user
        return context
    
    def get_queryset(self):
        current_counters = ShortcodeClass.objects.filter(url_creator=self.request.user.id)
        current_counters = ShortcodeClass.objects.filter(url_archivate=False)
        return current_counters


#Create Shortcode
def post_crate_view(request): 
    form = ShortcodeClassForm(data=request.POST)
    if request.is_ajax():
        print(form)
        if form.is_valid():
            form.save()

        return JsonResponse({
            'success': 'Dein link wurde erfolgreich erstellt',
            }, status=200)

    return JsonResponse({"error": "Error Test"}, status=400)


#Detaile Update View
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
        'url_tags': obj.url_tags,
        'url_active': obj.url_active,
        'url_archivate': obj.url_archivate,
        'url_content': obj.url_content,
        'url_archivate': obj.url_archivate
    }

    return JsonResponse({'data':data})

#Archivieren Shortcode
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
def update_post(request, pk):
    obj = ShortcodeClass.objects.get(pk=pk)
    if request.is_ajax():
        new_destination = request.POST.get('url_destination')
        new_titel       = request.POST.get('url_titel')
        new_source      = request.POST.get('url_source')
        new_medium      = request.POST.get('url_medium')
        new_term        = request.POST.get('url_term')
        new_campaign    = request.POST.get('url_campaign')
        new_tags        = request.POST.get('url_tags')
        new_content     = request.POST.get('url_content')
        
        obj.url_destination = new_destination
        obj.url_titel       = new_titel
        obj.url_source      = new_source
        obj.url_medium      = new_medium
        obj.url_term        = new_term
        obj.url_campaign    = new_campaign
        obj.url_tags        = new_tags
        obj.url_content     = new_content
        obj.save()
        return JsonResponse({'success': 'Dein link wurde erfolgreich geändert',})
