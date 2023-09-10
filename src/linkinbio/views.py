import json
import requests
from bs4 import BeautifulSoup
from django.db import models
from django.db import transaction

from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseServerError
from django.http import HttpResponse
from django.views import View
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin
from shortcode.models import ShortcodeClass
from .models import LinkInBio, LinkInBioLink
from .forms import LinkInBioDashboardForm


# Ajax-Anfrage zum Speichern der Reihenfolge
class UpdateLinksOrderView(View):
    def post(self, request):
        try:
            sorted_links = request.POST.getlist('sorted_links[]')
            print(sorted_links)
            # Hier musst du die Datenbank entsprechend aktualisieren, um die Reihenfolge zu speichern
            for index, link_id in enumerate(sorted_links):
                link = LinkInBioLink.objects.get(id=link_id)
                link.order = index + 1  # Ordne die Reihenfolge neu
                link.save()

            response_data = {'success': True, 'message': 'Reihenfolge erfolgreich gespeichert.'}
            return JsonResponse(response_data)
        except Exception as e:
            response_data = {'success': False, 'message': str(e)}
            return JsonResponse(response_data, status=400)




# Link liste Datile LinkInBio
class LinkInBioLinksListView(View):
    def get(self, request, linkinbio_id):
        try:
            # Holen Sie sich die LinkInBio-Seite anhand ihrer ID
            linkinbio = LinkInBio.objects.get(id=linkinbio_id)

            # Holen Sie sich alle Links in der gewünschten Reihenfolge
            links = LinkInBioLink.objects.filter(link_in_bio=linkinbio).order_by('order')

            # Erstellen Sie eine Liste von Links im JSON-Format
            links_data = [
                {
                    'id': link.id,
                    'button_label': link.shortcode.button_label,
                    'url_destination': link.shortcode.url_destination,
                    'order': link.order,
                    'url_titel': link.shortcode.url_titel
                }
                for link in links
            ]

            return JsonResponse({'links': links_data})

        except LinkInBio.DoesNotExist:
            return JsonResponse({'error': 'LinkInBio-Seite nicht gefunden'}, status=404)


# Sorcode Save LinkInBio
class CreateLinkView(View):
    @transaction.atomic
    def post(self, request):
        try:
            data = json.loads(request.body)
            shortcode_id = data.get('shortcode_id')
            linkinbio_page_id = data.get('linkinbio_page_id')
            button_label = data.get('button_label')

            # Holen Sie das ShortcodeClass-Objekt und die LinkInBio-Seite
            try:
                shortcode = ShortcodeClass.objects.get(id=shortcode_id)
                linkinbio_page = LinkInBio.objects.get(id=linkinbio_page_id)
            except (ShortcodeClass.DoesNotExist, LinkInBio.DoesNotExist):
                response_data = {'success': False, 'message': 'Ungültige Shortcode- oder LinkInBio-Seite.'}
                return JsonResponse(response_data, status=400)

            shortcode.button_label = button_label
            shortcode.save()

            # Überprüfen Sie, ob das ShortcodeClass-Objekt und die LinkInBio-Seite gültig sind
            linkinbio_page.links.add(shortcode)

            current_order = LinkInBioLink.objects.filter(link_in_bio=linkinbio_page_id).aggregate(max_order=models.Max('order'))['max_order'] or 0
            new_order = current_order + 1
            LinkInBioLink.objects.create(link_in_bio=linkinbio_page, shortcode=shortcode, order=new_order)

            response_data = {'success': True, 'message': 'Shortcode mit LinkInBio verknüpft.'}
            return JsonResponse(response_data)

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
        
            # Dies stelle anpssen
            current_order = LinkInBioLink.objects.filter(link_in_bio=selected_linkinbio_page).aggregate(max_order=models.Max('order'))['max_order'] or 0
            new_order = current_order + 1
            
            LinkInBioLink.objects.create(link_in_bio=selected_linkinbio_page, shortcode=shortcode, order=new_order)
            
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