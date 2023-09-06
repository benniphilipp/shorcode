import requests
from django.http import JsonResponse

from django.views import View
from django.views.generic.edit import FormView

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string


from .forms import GeoThemplateForm
from .models import GeoThemplate


@login_required(login_url="/login/")
def index_geo_targeting(request):
    form = GeoThemplateForm()
    context = {
        'form': form
    }
    return render(request, 'index-geo-targeting-view.html', context)

# Datile Geo View
class GeoThemplateDetailView(View):
    def get(self, request, pk):
        geo_template = get_object_or_404(GeoThemplate, pk=pk)
        data = {
            'template_user': geo_template.themplate_user.id,
            'template_name': geo_template.themplate_name,
            'land': geo_template.land,
            'template_region': geo_template.themplate_region,
            'id': geo_template.id,
        }
        return JsonResponse(data)

# List View Geo
def geo_themplate_list_view(request):
    geothemplate = GeoThemplate.objects.filter(themplate_user=request.user)
    data = [{'themplate_name': item.themplate_name, 'land': item.land, 'themplate_region': item.themplate_region, 'id': item.pk} for item in geothemplate]
    return JsonResponse(data, safe=False)


# Form View Geo
class GeoThemplateListView(FormView):
    template_name = 'index-geo-targeting-view.html'
    form_class = GeoThemplateForm
    success_url = '/geotargeting/list/'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['geothemplates'] = GeoThemplate.objects.all()
        return context
    
    def form_valid(self, form):
        form.save()
        response_data = {'success': True, 'message': 'Das Formular wurde erfolgreich gesendet.'}
        return JsonResponse(response_data)


# Update View GEO
class GeoThemplateUpdateView(View):
    def post(self, request, pk):
        geo_template = get_object_or_404(GeoThemplate, pk=pk)
        form = GeoThemplateForm(request.POST, instance=geo_template)

        if form.is_valid():

            geo_template.themplate_name = form.cleaned_data['themplate_name']
            geo_template.land = form.cleaned_data['land']
            geo_template.themplate_region = form.cleaned_data['themplate_region']
            geo_template.themplate_user = form.cleaned_data['themplate_user']

            geo_template.save()
            return JsonResponse({'success': True, 'message': 'GEO Vorlage erfolgreich aktualisiert.'})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})


# Delate View
class GeoThemplateDeleteView(View):
    def post(self, request, pk):
        geo_template = get_object_or_404(GeoThemplate, pk=pk)
        geo_template.delete()
        return JsonResponse({'success': True, 'message': 'GEO Vorlage wurde gelöscht.'})
    

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
    
    
def get_regions(request, geoname_id):
    username = 'benjaminphilipp'
    base_url = f'http://api.geonames.org/childrenJSON?geonameId={geoname_id}&username={username}'

    response = requests.get(base_url)

    if response.status_code == 200:
        data = response.json()
        regions = data.get('geonames', [])
        return JsonResponse(regions, safe=False)
    else:
        return JsonResponse([], safe=False)