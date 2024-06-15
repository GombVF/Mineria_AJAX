function limpiarImagenes(id) {
  const imagenes = document.querySelector(id);
  let imagen = imagenes.lastElementChild;
  while (imagen) {
    imagenes.removeChild(imagen);
    imagen = imagenes.lastElementChild
  }
}

function definirEstandarizado() {
  $.ajax({
    type: 'POST',
    url: '/datosPredeterminados',
    data: {
      std: $('#std').val(),
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
    success: function (data) {
      const obj = JSON.parse(data)
      const matrix = document.getElementById("Matrix");
      let curva = document.getElementById("curva");
      if (matrix) {
        matrix.remove();
      }
      if (curva) {
        curva.remove();
        const p = document.getElementById('parrafo').remove();
      }
      curva = '<img id="curva" src="data:image/png;base64,' + obj['curva'] + '">'
      $('#StdMatrix').append(obj['mestandarizada'])
      $('#elbow').append(curva)
      $('#elbow').append("<p id='parrafo'>Con " + obj['com'] + " componentes se logra " + obj['var'] + " de varianza acumulada</p>");
      const hue = document.getElementById('hue')
      if (hue)
        return
      let ctag = "<select name='hue' id='hue'>"
      const columnas = obj['columnas']
      const boton = "<button onclick='dibujarHue()'>Dibujar</button>"
      let opciones = ''
      columnas.forEach(element => {
        opciones += "<option>" + element + "</option>"
      });
      ctag += opciones + "</select>"
      $('#hueSection').append(ctag)
      $('#hueSection').append(boton)
    }
  })
}

function dibujarHue() {
  $.ajax({
    type: 'POST',
    url: '/graficaComparativa',
    data: {
      variable: $('#hue').val(),
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
    success: function (data) {
      const obj = JSON.parse(data)
      const hueImg = document.getElementById('hueImg')
      if (hueImg)
        hueImg.remove()
      $('#hueSection').append('<img id="hueImg" src="data:image/png;base64,' + obj['hue'] + '">')
      const disp = document.getElementById('dispImg')
      if (disp)
        disp.remove()
      let ctag1 = "<select name='hue' id='col1'>"
      let ctag2 = "<select name='hue' id='col2'>"
      const columnas = obj['columnas']
      const boton1 = "<button onclick='dibujarDispersion()'>Comparar</button>"
      const boton2 = "<button onclick='limpiarImagenes(" + '"#dispersion"' + ")'>Limpiar</button>"
      let opciones = ''
      columnas.forEach(element => {
        opciones += "<option>" + element + "</option>"
      });
      ctag1 += opciones + "</select>"
      ctag2 += opciones + "</select>"
      $('#hueSection').append(ctag1)
      $('#hueSection').append(ctag2)
      $('#hueSection').append(boton1)
      $('#hueSection').append(boton2)
    }
  })
}

function dibujarDispersion() {
  $.ajax({
    type: 'POST',
    url: '/graficaDispersion',
    data: {
      hue: $('#hue').val(),
      var1: $('#col1').val(),
      var2: $('#col2').val(),
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
    success: function (data) {
      const obj = JSON.parse(data)
      $('#dispersion').append('<img id="dispIMG" src="data:image/png;base64,' + obj + '">')
    }
  })
}