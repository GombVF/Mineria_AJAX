function limpiarImagenes(id) {
  const imagenes = document.querySelector(id);
  let imagen = imagenes.lastElementChild;
  while (imagen) {
    imagenes.removeChild(imagen);
    imagen = imagenes.lastElementChild
  }
}

function dibujarHistogramas() {
  $.ajax({
    type: 'POST',
    url: '/graficasHistograma',
    data: {
      columns: $('#colHist').val(),
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
    success: function (data) {
      const obj = JSON.parse(data)
      const imgArray = []
      for (let i in obj)
        imgArray.push(obj[i])
      for (let i in imgArray) {
        $('#histogramas').append('<img src="data:image/png;base64,' + imgArray[i] + '">')
      }
    }
  })
}

function dibujarCount() {
  let max = $('#numDatos').val();
  if (!max) {
    alert('Ingrese un número ...')
    return
  }
  $.ajax({
    type: 'POST',
    url: '/graficasCountplot',
    data: {
      columns: $('#colCount').val(),
      num: $('#numDatos').val(),
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
    success: function (data) {
      const obj = JSON.parse(data)
      const imgArray = []
      for (let i in obj)
        imgArray.push(obj[i])
      for (let i in imgArray) {
        $('#countplot').append('<img id="imgCount' + i + '" src="data:image/png;base64,' + imgArray[i] + '">')
      }
    }
  })
}

function dibujarGatos() {
  $.ajax({
    type: 'POST',
    url: '/graficasGato',
    data: {
      columns: $('#colGato').val(),
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
    success: function (data) {
      const obj = JSON.parse(data)
      const imgArray = []
      for (let i in obj)
        imgArray.push(obj[i])
      for (let i in imgArray) {
        $('#gato').append('<img id="imgCount' + i + '" src="data:image/png;base64,' + imgArray[i] + '">')
      }
    }
  })
}
