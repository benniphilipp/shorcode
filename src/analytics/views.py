from django.views.generic.base import View
from django.shortcuts import render


from django.http import JsonResponse
from django.views import View
from .models import ClickEvent


# Create your views here.
class AnalyticsView(View):
  def get(self, request, *args, **kwargs):
        return render(request, "analytics.html")



class ClickDataView(View):
    def get(self, request, *args, **kwargs):
        click_events = ClickEvent.objects.all()
        data = [{'timestamp': event.timestamp.isoformat(), 'count': event.count} for event in click_events]
        return JsonResponse(data, safe=False)


# https://www.chartjs.org/docs/latest/charts/bar.html
# https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript
# https://stackoverflow.com/questions/3514784/how-to-detect-a-mobile-device-using-jquery
