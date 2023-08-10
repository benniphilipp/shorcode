from django.views.generic.base import View
from django.shortcuts import render

# Create your views here.
class AnalyticsView(View):
  def get(self, request, *args, **kwargs):
        return render(request, "analytics.html")


# https://www.chartjs.org/docs/latest/charts/bar.html
# https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript
# https://stackoverflow.com/questions/3514784/how-to-detect-a-mobile-device-using-jquery
