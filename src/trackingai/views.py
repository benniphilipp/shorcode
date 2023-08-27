from django.shortcuts import render
from django.http import HttpResponse

def trackingai(request):
   return render(request, 'trackingai_list.html')
