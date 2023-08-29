from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import UpdateView
from django.utils.timezone import make_aware
from datetime import datetime

from shortcode.forms import GeoTargetingForm, LimitationShorcodeForm, AndroidTargetingForm, IosTargetingForm
from shortcode.models import ShortcodeClass
from geotargeting.models import GeoThemplate

"""Deatile View Android-Targeting"""
@login_required(login_url="/login/")
def get_deatile_android_targeting(request,pk):
    if request.method == 'GET':
        try:
            shortcode = ShortcodeClass.objects.get(pk=pk)
            return JsonResponse({'success': True, 'status_switches': shortcode.android_on_off})
        except ShortcodeClass.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Shortcode nicht gefunden.'})
    else:
        return JsonResponse({'success': False, 'message': 'Nur GET-Anfragen sind erlaubt.'})

"""Deatile View iOS-Targeting"""
@login_required(login_url="/login/")
def get_detaile_ios_targeting(request, pk):
    if request.method == 'GET':
        try:
            shortcode = ShortcodeClass.objects.get(pk=pk)
            return JsonResponse({'success': True, 'status_switches': shortcode.ios_on_off})
        except ShortcodeClass.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Shortcode nicht gefunden.'})
    else:
        return JsonResponse({'success': False, 'message': 'Nur GET-Anfragen sind erlaubt.'})

"""Deatile View Geo-Targeting"""
@login_required(login_url="/login/")
def get_detaile_geo_targeting(request, pk):
    if request.method == 'GET':
        try:
            shortcode = ShortcodeClass.objects.get(pk=pk)
            return JsonResponse({'success': True, 'status_switches': shortcode.geo_targeting_on_off})
        except ShortcodeClass.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Shortcode nicht gefunden.'})
    else:
        return JsonResponse({'success': False, 'message': 'Nur GET-Anfragen sind erlaubt.'})

"""Deatile View Limitation"""
@login_required(login_url="/login/")
def get_limitation_active_status(request, pk):
    if request.method == 'GET':
        try:
            shortcode = ShortcodeClass.objects.get(pk=pk)
            return JsonResponse({'success': True, 'status_switches': shortcode.limitation_active})
        except ShortcodeClass.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Shortcode nicht gefunden.'})
    else:
        return JsonResponse({'success': False, 'message': 'Nur GET-Anfragen sind erlaubt.'})


"""Update View Limitation"""
@login_required(login_url="/login/")
def toggle_limitation_active_status(request, pk):
    if request.method == 'POST':
        try:
            shortcode = ShortcodeClass.objects.get(pk=pk)
            shortcode.limitation_active = not shortcode.limitation_active
            shortcode.save()
            return JsonResponse({'success': True, 'status_switches': shortcode.limitation_active})
        except ShortcodeClass.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Shortcode nicht gefunden.'})
    else:
        return JsonResponse({'success': False, 'message': 'Nur POST-Anfragen sind erlaubt.'})

"""Update View Geo-Targeting"""
@login_required(login_url="/login/")
def toggle_geo_targeting_active_satus(request, pk):
    if request.method == 'POST':
        try:
            shortcode = ShortcodeClass.objects.get(pk=pk)
            shortcode.geo_targeting_on_off = not shortcode.geo_targeting_on_off
            shortcode.save()
            return JsonResponse({'success': True, 'status_switches': shortcode.geo_targeting_on_off})
        except ShortcodeClass.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Shortcode nicht gefunden.'})
    else:
        return JsonResponse({'success': False, 'message': 'Nur POST-Anfragen sind erlaubt.'})

"""Update View Android-Targeting"""
@login_required(login_url="/login/")
def toggle_android_targeting_active_status(request, pk):
    if request.method == 'POST':
        try:
            shortcode = ShortcodeClass.objects.get(pk=pk)
            shortcode.android_on_off = not shortcode.android_on_off
            shortcode.save()
            return JsonResponse({'success': True, 'status_switches': shortcode.android_on_off})
        except ShortcodeClass.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Shortcode nicht gefunden.'})
    else:
        return JsonResponse({'success': False, 'message': 'Nur POST-Anfragen sind erlaubt.'})

"""Update View iOS-Targeting"""
@login_required(login_url="/login/")
def toggle_ios_targeting_active_status(request, pk):
    if request.method == 'POST':
        try:
            shortcode = ShortcodeClass.objects.get(pk=pk)
            shortcode.ios_on_off = not shortcode.ios_on_off
            shortcode.save()
            return JsonResponse({'success': True, 'status_switches': shortcode.ios_on_off})
        except ShortcodeClass.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Shortcode nicht gefunden.'})
    else:
        return JsonResponse({'success': False, 'message': 'Nur POST-Anfragen sind erlaubt.'})
    
    
"""Update View Limitation"""
class limitationTargetingUpdateView(LoginRequiredMixin, UpdateView):
    model = ShortcodeClass
    form_class = LimitationShorcodeForm

    def form_valid(self, form):
        new_start_date = self.request.POST.get('id_start_date')
        new_end_date = self.request.POST.get('id_end_date')
        new_count = self.request.POST.get('id_count')
        new_alternative_url= self.request.POST.get('id_alternative_url')

        try:            
            self.object.count = new_count
            self.object.alternative_url = new_alternative_url
            self.object.start_date = new_start_date
            self.object.end_date = new_end_date
            self.object.save()
            
            response_data = {
                'success': True,
                'message': 'Formular wurde erfolgreich aktualisiert.'
            }
        except Exception as e:
            response_data = {
                'success': False,
                'message': 'Fehler beim Aktualisieren des Formulars: ' + str(e)
            }
        
        return JsonResponse(response_data)
    
    def form_invalid(self, form):
        response_data = {
            'success': False,
            'errors': form.errors
        }
        return JsonResponse(response_data, status=400)
    
"""Geo-Targeting"""
class GeoTargetingUpdateView(LoginRequiredMixin, UpdateView):
    model = ShortcodeClass
    form_class = GeoTargetingForm
    
    def form_valid(self, form):
        template_geo = self.request.POST.get('id_template_geo')
        new_link_geo = self.request.POST.get('id_link_geo')
        
        new_template_geo = GeoThemplate.objects.filter(id=template_geo).first()
        print(new_template_geo)
        print(new_link_geo)
        try: 
            self.object.template_geo = new_template_geo
            self.object.link_geo = new_link_geo
            self.object.save()
            
            response_data = {
                'success': True,
                'message': 'Formular wurde erfolgreich aktualisiert.'
            }
            
        except Exception as e:
            response_data = {
                'success': False,
                'message': 'Fehler beim Aktualisieren des Formulars: ' + str(e)
            }
        
        return JsonResponse(response_data)
    
    def form_invalid(self, form):
        response_data = {
            'success': False,
            'errors': form.errors
        }
        return JsonResponse(response_data, status=400)

"""Android-Targeting"""
class AndroidTargetingUpdateView(LoginRequiredMixin, UpdateView):
    model = ShortcodeClass
    form_class = AndroidTargetingForm
    
    def form_valid(self, form):
        new_android = self.request.POST.get('android')
        print(new_android)
        
        try:
            self.object.android = new_android
            self.object.save()
            
            response_data = {
                'success': True,
                'message': 'Formular wurde erfolgreich aktualisiert.'
            }
            
        except Exception as e:
            response_data = {
                'success': False,
                'message': 'Fehler beim Aktualisieren des Formulars: ' + str(e)
            }
        
        return JsonResponse(response_data)
    
    def form_invalid(self, form):
        response_data = {
            'success': False,
            'errors': form.errors
        }
        return JsonResponse(response_data, status=400)

"""iOS-Targeting"""
class IosTargetingUpdateView(LoginRequiredMixin, UpdateView):
    model = ShortcodeClass
    form_class = IosTargetingForm

    def form_valid(self, form):
        new_ios = self.request.POST.get('ios')
        
        try:
            self.object.ios = new_ios
            self.object.save()
            
            response_data = {
                'success': True,
                'message': 'Formular wurde erfolgreich aktualisiert.'
            }
            
        except Exception as e:
            response_data = {
                'success': False,
                'message': 'Fehler beim Aktualisieren des Formulars: ' + str(e)
            }
        
        return JsonResponse(response_data)
    
    def form_invalid(self, form):
        response_data = {
            'success': False,
            'errors': form.errors
        }
        return JsonResponse(response_data, status=400)
    