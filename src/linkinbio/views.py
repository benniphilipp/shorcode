import json
import requests
from django.urls import reverse
from bs4 import BeautifulSoup
from django.db import models
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.http import HttpRequest

from django.views.decorators.http import require_POST

from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseServerError
from django.http import HttpResponse
from django.views import View
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin
from shortcode.models import ShortcodeClass
from .models import LinkInBio, LinkInBioLink, CustomSettings, SocialMediaPlatform, UrlSocialProfiles
from .forms import LinkInBioDashboardForm


class SocialMediaProfilesView(View):
    def get(self, request, link_in_bio_id):
        try:
            link_in_bio = LinkInBio.objects.get(pk=link_in_bio_id)
            social_media_profiles = UrlSocialProfiles.objects.filter(link_in_bio=link_in_bio)

            data = [{'platform': profile.social_media_platform.name, 'url': profile.url_social, 'id': profile.pk} for profile in social_media_profiles]

            return JsonResponse({'social_media_profiles': data})

        except LinkInBio.DoesNotExist:
            return JsonResponse({'error': 'LinkInBio not found'}, status=404)


# Save Url Social Profiles
class SaveUrlSocialView(View):
    def post(self, request):
        try:
            url_social = request.POST.get('url_social')
            link_in_bio_id = request.POST.get('link_in_bio_id')
            social_media_platform = request.POST.get('social_media_platform')

            platform_instance = SocialMediaPlatform.objects.get(id=social_media_platform)
            # Prüfen, ob ein LinkInBio-Eintrag mit der angegebenen ID existiert
            link_in_bio = LinkInBio.objects.get(id=link_in_bio_id)

            # URL in das Modell speichern
            url_social_profile = UrlSocialProfiles(url_social=url_social, link_in_bio=link_in_bio, social_media_platform=platform_instance)
            url_social_profile.save()

            response_data = {'success': True, 'message': 'URL erfolgreich gespeichert.'}
            return JsonResponse(response_data)

        except LinkInBio.DoesNotExist:
            response_data = {'success': False, 'message': 'LinkInBio-Seite nicht gefunden.'}
            return JsonResponse(response_data, status=404)


# Social Media Platform
def get_social_media_platforms(request):
    platforms = SocialMediaPlatform.objects.all()
    data = [{'id': platform.id, 'name': platform.name} for platform in platforms]
    return JsonResponse({'platforms': data})


# Ajax-Anfrage zum Speichern der Reihenfolge
class UpdateLinksOrderView(View):
    def post(self, request):
        try:
            sorted_links = request.POST.getlist('sorted_links[]')

            for index, link_id in enumerate(sorted_links):
                link = LinkInBioLink.objects.get(id=link_id)
                link.order = index + 1
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

            links_data = [{
                    'id': link.id,
                    'button_label': link.shortcode.button_label,
                    'url_destination': link.shortcode.url_destination,
                    'shortcode_url': link.shortcode.shortcode,
                    'order': link.order,
                    'url_titel': link.shortcode.url_titel,
                    'link_in_bio_page': link.link_in_bio.id,
                    'shortcode_id': link.shortcode.id,
                    'is_aktiv': link.is_aktiv,
                }
                for link in links
            ]

            return JsonResponse({'links': links_data})

        except LinkInBio.DoesNotExist:
            return JsonResponse({'error': 'LinkInBio-Seite nicht gefunden'}, status=404)



class updateSwichtLinkinbioAtive(View):
    def post(self, request, pk):
        try:

            linkinbio = LinkInBioLink.objects.get(id=pk)

            linkinbio.is_aktiv = not linkinbio.is_aktiv

            linkinbio.save()

            response_data = {'success': True, 'message': 'Link erfolgreich aktualisiert.'}
            return JsonResponse(response_data)
            
            
        except json.JSONDecodeError:
            response_data = {'success': False, 'message': 'Ungültiges JSON-Format.'}
            return JsonResponse(response_data, status=400)

'''
@Create Link
Die vorhandene Shortcode wird ausgewählt und mit dem LinkInBio verknüpft.
'''
class CreateLinkView(View):
    @transaction.atomic
    def post(self, request):
        try:
            shortcode_id = request.POST.get('shortcode_id')
            linkinbio_page_id = request.POST.get('linkinbio_page_id')
            button_label = request.POST.get('button_label')

            try:
                shortcode = ShortcodeClass.objects.get(id=shortcode_id)
                linkinbio_page = LinkInBio.objects.get(id=linkinbio_page_id)
            except (ShortcodeClass.DoesNotExist, LinkInBio.DoesNotExist):
                response_data = {'success': False, 'message': 'Ungültige Shortcode- oder LinkInBio-Seite.'}
                return JsonResponse(response_data, status=400)

            shortcode.button_label = button_label
            shortcode.save()


            linkinbio_page.links.add(shortcode)

            current_order = LinkInBioLink.objects.filter(link_in_bio=linkinbio_page_id).aggregate(max_order=models.Max('order'))['max_order'] or 0
            new_order = current_order + 1
            LinkInBioLink.objects.create(link_in_bio=linkinbio_page, shortcode=shortcode, order=new_order)

            response_data = {'success': True, 'message': 'Shortcode mit LinkInBio verknüpft.'}
            return JsonResponse(response_data)

        except json.JSONDecodeError:
            response_data = {'success': False, 'message': 'Ungültiges JSON-Format.'}
            return JsonResponse(response_data, status=400)


''''
@Crate Shorcode
Ein neuer Shortcode wird erstellt und mit der LinkInBio über die Seite 'LinkInBioLink' verbunden.
'''
class CreateShortcodeView(View):
    def post(self, request):
        try:
            # data = json.loads(request.body)
            button_label = request.POST.get('button_label', '')
            link_url = request.POST.get('link_url', '')
            linkinbio_page_id = request.POST.get('linkinbio_page')

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
        current_user = request.user
        link_in_bio_page_id = request.GET.get('link_in_bio_page_id')

        # Filtern Sie die Shortcodes nach dem aktuellen Benutzer und dem Suchbegriff
        shortcode_objects = ShortcodeClass.objects.filter(
            url_creator=current_user,
            url_titel__icontains=search_term
        )

        # Falls eine Link-in-Bio-Seiten-ID übergeben wurde, filtern Sie die Shortcodes weiter
        if link_in_bio_page_id:
            # Filtern Sie die Shortcodes basierend auf der übergebenen Link-in-Bio-Seiten-ID
            shortcode_objects = shortcode_objects.exclude(
                linkinbiolink__link_in_bio_id=link_in_bio_page_id
            )

        shortcode_data = [
            {
                'id': shortcode.id,
                'url_titel': shortcode.url_titel,
            }
            for shortcode in shortcode_objects
        ]

        return JsonResponse(shortcode_data, safe=False)



# ListView LinkInBio
class LinkInBioListView(LoginRequiredMixin, View):
    def get(self, request):

        link_in_bio_objects = LinkInBio.objects.filter(user=request.user)
        link_in_bio_form = LinkInBioDashboardForm()
        aktuelle_url = request.build_absolute_uri()
        
        context = {
            'link_in_bio_form': link_in_bio_form,
            'link_in_bio_objects': link_in_bio_objects,
            'aktuelle_url': aktuelle_url
        }

        return render(request, 'linkinbio_list.html', context)
    
    def post(self, request: HttpRequest):
        link_in_bio_form = LinkInBioDashboardForm(request.POST)

        if link_in_bio_form.is_valid():
            # Erstellen Sie die LinkInBio-Instanz, indem Sie das Formular speichern
            link_in_bio_instance = link_in_bio_form.save(commit=False)
            link_in_bio_instance.user = request.user
            link_in_bio_instance.save()
            
            detail_url = reverse('linkinbio:detail_page', args=[link_in_bio_instance.pk])
            full_detail_url = request.build_absolute_uri(detail_url)
            
            shortcode_instance = ShortcodeClass(
                url_creator=request.user,
                url_titel=link_in_bio_instance.title,
                url_destination=full_detail_url,
                linkinbiopage=link_in_bio_instance.pk
            )
            shortcode_instance.save()

            return redirect('linkinbio:linkinbio_detail', pk=link_in_bio_instance.pk)

        link_in_bio_objects = LinkInBio.objects.filter(user=request.user)

        context = {
            'link_in_bio_objects': link_in_bio_objects,
            'link_in_bio_form': link_in_bio_form,
        }

        return render(request, 'linkinbio_list.html', context)


# Deatile View für Page
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
    

# LinkInBio Links Detaile Json View
class LinksDetaileJsonView(View):
    def get(self, request, pk):
        try:
            link_in_bio_link = LinkInBioLink.objects.get(id=pk)
            data = {
                    'id': link_in_bio_link.id,
                    'url_destination': link_in_bio_link.shortcode.url_destination,
                    'shortcode_url': link_in_bio_link.shortcode.shortcode,
                    'button_label': link_in_bio_link.shortcode.button_label,
                    'shortcode_id': link_in_bio_link.shortcode.id,
                    'is_aktiv': link_in_bio_link.is_aktiv,
            }
            return JsonResponse(data)
        except LinkInBioLink.DoesNotExist:
            return JsonResponse({'error': 'LinkInBioLink not found'}, status=404)
        
'''
Update bestehner Shorcode link und Label für LinkInBio Seite.
'''
class UpdateShortcodeLinkInBioView(View):
    def post(self, request, pk):
        if request.method == 'POST':
            shortcode_id = request.POST.get('shortcode_id')
            button_label = request.POST.get('button_label')
            url_destination_new = request.POST.get('url_destination')
            
            if shortcode_id:
                try:
                    shortcode = ShortcodeClass.objects.get(pk=shortcode_id)
                    shortcode.button_label = button_label
                    shortcode.save()
                    
                    bio_page = LinkInBioLink.objects.get(pk=pk)
                    bio_page.shortcode = shortcode
                    bio_page.save()
                    
                    response_data = {'success': True, 'message': 'Shortcode gefunden und aktualisiert.'}
                except ShortcodeClass.DoesNotExist:
                    response_data = {'success': False, 'message': 'Shortcode nicht gefunden.'}
                
            else:
                
                shortcode = ShortcodeClass.objects.create(
                    url_destination=url_destination_new,
                    button_label=button_label,
                    url_creator=request.user
                )
                
                
                response_data = {'success': True, 'message': 'Neuer Shortcode erstellt.'}
                
            return JsonResponse(response_data)

        # Fügen Sie hier den Code für den Fall hinzu, dass die Anfrage nicht POST ist
        response_data = {'success': False, 'message': 'Ungültige Anfrage.'}
        return JsonResponse(response_data, status=400)



# Löschen Linkinlink
class LinkinbiolinkDeleteView(View):
    def post(self, request, pk):
        try:
            link = LinkInBioLink.objects.get(pk=pk)
            link.delete()
            return JsonResponse({'message': 'Datensatz erfolgreich gelöscht'})
        except LinkInBioLink.DoesNotExist:
            return JsonResponse({'message': 'Datensatz nicht gefunden'}, status=404)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)


# LinkinBio Page   
class LinkInBioDeatilePage(View):
    def get(self, request, pk):
        try:
            linkinbio = LinkInBio.objects.get(id=pk)
        except LinkInBio.DoesNotExist:
            raise Http404
        
        context = {
            'linkinbio_page': linkinbio
        }
        
        return render(request, 'linkinbio_page.html', context)


# UpdateView LinkInBio Singel
class LinkinbioDetaileJsonView(View):
    def get(self, request, pk):
        try:
            link_in_bio_link = LinkInBio.objects.get(id=pk)
            data = {
                    'id': link_in_bio_link.id,
                    'id_description': link_in_bio_link.description,
                    'id_title': link_in_bio_link.title,
            }
            return JsonResponse(data)
        except LinkInBio.DoesNotExist:
            return JsonResponse({'error': 'LinkInBioLink not found'}, status=404)

      
# UpdateForm LinkInBio Singel
class UpdateFormLinkInBioSingel(View):
    def post(self, request, pk):
        
        if request.method == 'POST':
            new_id_title = request.POST.get('id_title')
            new_id_description = request.POST.get('id_description')
        
            link_in_bio = LinkInBio.objects.get(id=pk)
            link_in_bio.title = new_id_title
            link_in_bio.description = new_id_description
            
            link_in_bio.save()
            
            response_data = {'success': True, 'message': 'LinkInBio aktualisiert.'}
            return JsonResponse(response_data)
       
 
# Deltete Linkinbio
class LinkinbiolinkDeleteView(View):
    def post(self, request, pk):
        try:
            bio = LinkInBio.objects.get(pk=pk)
            bio.delete()
            return JsonResponse({'message': 'Datensatz erfolgreich gelöscht'})
        except LinkInBioLink.DoesNotExist:
            return JsonResponse({'message': 'Datensatz nicht gefunden'}, status=404)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)


# Crate Image Profile Adjustment
class ImageSaveAdjustmentView(View):
    def post(self, request, pk, *args, **kwargs):
        try:
            image_data = request.FILES['image']
            linkinbiopage = LinkInBio.objects.get(pk=pk)

            # Speichere das Bild in der Link-in-Bio-Seite
            linkinbiopage.profile_image = image_data
            linkinbiopage.save()
            
            return JsonResponse({'message': 'Bild erfolgreich gespeichert'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


# Detaile Profile Image
class ProfileImageDetailView(LoginRequiredMixin, View):
    def get(self, request, pk):
        try:
            profileimage = get_object_or_404(LinkInBio, pk=pk, user=request.user)
            print(profileimage.profile_image.url)

            if profileimage.profile_image.url:
                data = [{'profile_image': profileimage.profile_image.url}]
            else:
                data = [{'profile_image': None}]
            
            return JsonResponse(data, safe=False)  # Anpassung hier: data direkt zurückgeben und safe=False setzen
            
        except LinkInBio.DoesNotExist:
            return JsonResponse({'error': 'LinkInBio not found'}, status=404)
       
 
# Ceate Texte Adjustment
class TexteCreateAdjustmentView(View):
    def post(self, request, pk, *args, **kwargs):
        try:
            title = request.POST.get('title')
            description = request.POST.get('description')
            
            linkinbiopage = LinkInBio.objects.get(pk=pk)

            # Speichere das Bild in der Link-in-Bio-Seite
            linkinbiopage.title = title
            linkinbiopage.description = description
            linkinbiopage.save()
            
            return JsonResponse({'message': 'Text erfolgreich gespeichert'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        

# Text View Adjustment
class TexteDeatileAdjustmentView(LoginRequiredMixin, View):
    def get(self, request, pk):
        try:
            text = get_object_or_404(LinkInBio, pk=pk, user=request.user)

            if text.title:
                data = [{
                    'title': text.title,
                    'description': text.description
                    }]
            else:
                data = [{'title': None}]
            
            return JsonResponse(data, safe=False)  # Anpassung hier: data direkt zurückgeben und safe=False setzen
            
        except LinkInBio.DoesNotExist:
            return JsonResponse({'error': 'LinkInBio not found'}, status=404)