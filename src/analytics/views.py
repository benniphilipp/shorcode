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
        click_data = [{'timestamp': event.timestamp, 'count': event.count, 'short_url': event.short_url.shortcode} for event in click_events]
        return JsonResponse(click_data, safe=False)


# https://www.chartjs.org/docs/latest/charts/bar.html
# https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript
# https://stackoverflow.com/questions/3514784/how-to-detect-a-mobile-device-using-jquery
