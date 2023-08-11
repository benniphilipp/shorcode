from django.views.generic.base import View
from django.shortcuts import render

from django.db.models import Count
from django.db.models.functions import TruncDate
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views import View
from .models import ClickEvent, DailyClick
from shortcode.models import ShortcodeClass


# Create your views here.
class AnalyticsView(View):
  def get(self, request, *args, **kwargs):
        return render(request, "analytics.html")



class ClickDataView(View):
    def get(self, request, *args, **kwargs):
        click_events = ClickEvent.objects.all()
        click_data = [{'timestamp': event.timestamp, 'count': event.count, 'short_url': event.short_url.shortcode} for event in click_events]
        return JsonResponse(click_data, safe=False)



def shortcode_click_data(request, shortcode):
    shortcode_obj = get_object_or_404(ShortcodeClass, shortcode=shortcode)
    
    click_data = DailyClick.objects.filter(short_url=shortcode_obj).annotate(
        click_date=TruncDate('timestamp')
    ).values('click_date').annotate(
        click_count=Count('id')
    ).order_by('click_date')
    
    click_data_json = list(click_data)
    return JsonResponse(click_data_json, safe=False)

# https://www.chartjs.org/docs/latest/charts/bar.html
# https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript
# https://stackoverflow.com/questions/3514784/how-to-detect-a-mobile-device-using-jquery
