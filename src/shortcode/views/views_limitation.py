from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

from shortcode.models import ShortcodeClass

"""Deatile View Limitation"""
@login_required(login_url="/login/")
def get_limitation_active_status(request, pk):
    if request.method == 'GET':
        try:
            shortcode = ShortcodeClass.objects.get(pk=pk)
            return JsonResponse({'success': True, 'limitation_active': shortcode.limitation_active})
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
            return JsonResponse({'success': True, 'new_limitation_active': shortcode.limitation_active})
        except ShortcodeClass.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Shortcode nicht gefunden.'})
    else:
        return JsonResponse({'success': False, 'message': 'Nur POST-Anfragen sind erlaubt.'})

"""Geo-Targeting
Beim Geo-Targeting werden alternative Links für den Shortcode hinterlegt.
"""

"""Android-Targeting"""

"""iOS-Targeting"""
