from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views import View
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import LinkInBio
from .forms import LinkInBioDashboardForm

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