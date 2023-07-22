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
        return current_counters



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

