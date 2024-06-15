from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.conf import settings
import pandas as pd
import json


def cargaDatos(request):
  data=''
  if request.method=='POST':
    settings.DATOS.append(pd.read_csv(request.FILES['csv_file']))
  if settings.DATOS:
    data=settings.DATOS[-1].to_html(max_rows=12)
  return render(request,'../templates/cargar/carga.html',context={'data':data})

