import json
import requests
from bs4 import BeautifulSoup

from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseServerError
from django.http import HttpResponse
from django.views import View
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin
from shortcode.models import ShortcodeClass
from .models import LinkInBio
from .forms import LinkInBioDashboardForm


# Sorcode Save LinkInBio
class CreateLinkView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            shortcode_id = data.get('shortcode_id')
            linkinbio_page_id = data.get('linkinbio_page_id')
            button_label = data.get('button_label')

            # Holen Sie das ShortcodeClass-Objekt und die LinkInBio-Seite
            shortcode = ShortcodeClass.objects.get(id=shortcode_id)
            linkinbio_page = LinkInBio.objects.get(id=linkinbio_page_id)
            
            shortcode.button_label = button_label
            shortcode.save()

            # Überprüfen Sie, ob das ShortcodeClass-Objekt und die LinkInBio-Seite gültig sind
            if shortcode and linkinbio_page:
                linkinbio_page.links.add(shortcode)

                response_data = {'success': True, 'message': 'Shortcode mit LinkInBio verknüpft.'}
                return JsonResponse(response_data)
            else:
                response_data = {'success': False, 'message': 'Ungültige Shortcode- oder LinkInBio-Seite.'}
                return JsonResponse(response_data, status=400)

        except json.JSONDecodeError:
            response_data = {'success': False, 'message': 'Ungültiges JSON-Format.'}
            return JsonResponse(response_data, status=400)


#Crate Shorcode
class CreateShortcodeView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            button_label = data.get('button_label', '')
            link_url = data.get('link_url', '')
            linkinbio_page_id = data.get('linkinbio_page')

            current_user = request.user

            # Senden Sie eine Anfrage an die Website
            response = requests.get(link_url)

            favicon_path = None


            if response.status_code == 200:
                # Extrahieren Sie das Favicon aus dem HTML der Website
                soup = BeautifulSoup(response.content, 'html.parser')
                favicon_link = soup.find("link", rel="icon")

                if favicon_link:
                    favicon_path = favicon_link["href"]
                    if not favicon_path.startswith('http'):
                        # Handle relative URLs
                        base_url = link_url.split('/')[2]
                        favicon_path = f'http://{base_url}/{favicon_path}'

            # Erstellen Sie den Shortcode, unabhängig davon, ob ein Favicon gefunden wurde
            shortcode = ShortcodeClass.objects.create(
                url_creator=current_user,
                url_titel=button_label,
                url_destination=link_url,
                favicon_path=favicon_path,
                button_label=button_label
            )

            selected_linkinbio_page = LinkInBio.objects.get(id=linkinbio_page_id)
            selected_linkinbio_page.links.add(shortcode)

            response_data = {'success': True, 'message': 'Shortcode erstellt und zur LinkInBio hinzugefügt.'}
            return JsonResponse(response_data)

        except json.JSONDecodeError:
            response_data = {'success': False, 'message': 'Ungültiges JSON-Format.'}
            return JsonResponse(response_data, status=400)




#Autocomplete
class ShortcodeClassListView(View):
    def get(self, request):
        search_term = request.GET.get('search_term', '')
        # Holen Sie alle ShortcodeClass-Objekte, die dem angemeldeten Benutzer gehören
        current_user = request.user
        shortcode_objects = ShortcodeClass.objects.filter(url_creator=current_user, url_titel__icontains=search_term)

        # Erstellen Sie eine Liste mit den gewünschten Daten
        shortcode_data = [
            {
                'id': shortcode.id,
                'url_titel': shortcode.url_titel,
                # Fügen Sie hier alle Felder hinzu, die Sie im JSON-Format benötigen
            }
            for shortcode in shortcode_objects
        ]

        return JsonResponse(shortcode_data, safe=False)



# ListView LinkInBio
class LinkInBioListView(LoginRequiredMixin, View):

    def get(self, request):

        link_in_bio_objects = LinkInBio.objects.filter(user=request.user)
        link_in_bio_form = LinkInBioDashboardForm()
        context = {
            'link_in_bio_objects': link_in_bio_objects,
            'link_in_bio_form': link_in_bio_form
        }

        return render(request, 'linkinbio_list.html', context)
    
    def post(self, request):
        link_in_bio_form = LinkInBioDashboardForm(request.POST)

        if link_in_bio_form.is_valid():
            # Erstellen Sie die LinkInBio-Instanz, indem Sie das Formular speichern
            link_in_bio_instance = link_in_bio_form.save(commit=False)
            link_in_bio_instance.user = request.user
            link_in_bio_instance.save()

            # Hier anpassen, um zur Detailansicht der gerade erstellten Instanz zu gelangen
            return redirect('linkinbio:linkinbio_detail', pk=link_in_bio_instance.pk)

        link_in_bio_objects = LinkInBio.objects.filter(user=request.user)

        context = {
            'link_in_bio_objects': link_in_bio_objects,
            'link_in_bio_form': link_in_bio_form,
        }

        return render(request, 'linkinbio_list.html', context)

# Deatile View
class LinkInBioDetailView(LoginRequiredMixin, View):

    def get(self, request, pk):
        try:
            # Holen Sie die LinkInBio-Instanz anhand des Primärschlüssels (pk)
            link_in_bio_instance = LinkInBio.objects.get(pk=pk, user=request.user)
        except LinkInBio.DoesNotExist:
            # Wenn die Instanz nicht existiert, werfen Sie eine Http404-Ausnahme
            raise Http404

        context = {
            'link_in_bio_instance': link_in_bio_instance,
        }

        return render(request, 'linkinbio_detail.html', context)