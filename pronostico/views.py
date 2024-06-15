from django.shortcuts import render, redirect
from django.conf import settings
from django.http import HttpResponse
import pandas as pd               
import numpy as np
import matplotlib              
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns 
import io
import urllib, base64
from sklearn import model_selection
from sklearn.tree import DecisionTreeRegressor, plot_tree
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import json

def procesamiento(request):
  if not settings.DATOS:
    return redirect('../')
  data={
  }
  df=settings.DATOS[-1]
  data['columnas']=df.select_dtypes(exclude='object').columns
  return render(request,'../templates/pronostico/pronostico.html',{'data':data})

def graficaComparativa(request):
  if request.method=='POST':
    columnas=request.POST.getlist('col[]','')
    if len(columnas)==0:
      return HttpResponse('')
    df=settings.DATOS[-1]
    data=[]
    plt.clf()
    plt.grid()
    for i in columnas:
      plt.plot(df[i])
      fig=plt.gcf()
      plt.xlabel('Número de componentes')
      plt.ylabel(i)
      buf=io.BytesIO()
      fig.savefig(buf,format='png')
      buf.seek(0)
      string=base64.b64encode(buf.read())
      uri=urllib.parse.quote(string)
      data.append(uri)
      uri=''
    
    data=json.dumps(data)
    return HttpResponse(data)
  
def realizarPronosticoArbol(request):
  if request.method=='POST':
    test=request.POST.get('test')
    Yvar=request.POST['y']
    df=settings.DATOS[-1]
    df=df.select_dtypes(exclude='object').dropna()
    dfX=df.drop(columns=Yvar)
    X=np.array(dfX)
    data={}
    data['X']=pd.DataFrame(X).to_html(max_rows=12)
    Y=np.array(df[Yvar])
    data['Y']=pd.DataFrame(Y).to_html(max_rows=12)
    X_train,X_test,Y_train,Y_test=model_selection.train_test_split(X,Y,test_size=None,random_state=0,shuffle=True)
    data['Xtest']=pd.DataFrame(X_test).to_html(max_rows=12)

    pronosticoAD= DecisionTreeRegressor(random_state=0)
    pronosticoAD.fit(X_train,Y_train)
    Y_pronostico=pronosticoAD.predict(X_test)
    data['Ycomp']=pd.DataFrame(Y_test,Y_pronostico).to_html(max_rows=12)
    data['r2']=r2_score(Y_test,Y_pronostico)
    data['criterio']=pronosticoAD.criterion
    #data['impVar']=pronosticoAD.feature_importances_
    data['mae']=mean_absolute_error(Y_test,Y_pronostico)
    data['mse']=mean_squared_error(Y_test,Y_pronostico)
    data['rmse']=mean_squared_error(Y_test,Y_pronostico,squared=False)

    plt.close()
    sns.set()
    plt.clf()
    plt.plot(Y_test,color='red',marker='+',label='Real')
    plt.plot(Y_pronostico,color='green',marker='+',label='Estimado')

    fig=plt.gcf()
    fig.tight_layout()
    buf=io.BytesIO()
    fig.savefig(buf,format='png')
    buf.seek(0)
    string=base64.b64encode(buf.read())
    uri=urllib.parse.quote(string)
    data['uri']=uri
    plt.clf()
    uri=''
    plt.close()
    sns.set()
    plt.clf()
    plot_tree(pronosticoAD,feature_names=list(dfX.columns))
    fig=plt.gcf()
    fig.tight_layout()
    buf=io.BytesIO()
    fig.savefig(buf,format='png')
    buf.seek(0)
    string=base64.b64encode(buf.read())
    uri=urllib.parse.quote(string)
    data['tree']=uri
    data=json.dumps(data)
    return HttpResponse(data)