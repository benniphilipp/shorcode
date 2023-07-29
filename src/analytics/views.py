from django.views.generic.base import View
from django.shortcuts import render

# Create your views here.
class AnalyticsView(View):
  def get(self, request, *args, **kwargs):
        return render(request, "analytics.html")
