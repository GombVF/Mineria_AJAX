function limpiarImagenes(id) {
  const imagenes = document.querySelector(id);
  let imagen = imagenes.lastElementChild;
  while (imagen) {
    imagenes.removeChild(imagen);
    imagen = imagenes.lastElementChild
  }
}

$(document).on('submit', '#graficas', function (e) {
  e.preventDefault();
  let columnas = $('#columnas').val()
  $.ajax({
    type: 'POST',
    url: '/graficaComparativa',
    data: {
      col: columnas,
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
    success: function (data) {
      const obj = JSON.parse(data)
      const imgArray = []
      for (let i in obj)
        imgArray.push(obj[i])
      let imagen = new Image();
      for (let i in imgArray) {
        $('#img-graficas').append('<img src="data:image/png;base64,' + imgArray[i] + '">')
      }
    }
  })
});


$(document).on('change', '#metodo', function () {
  const metodo = document.getElementById('metodo').value;
  const arboles = document.getElementById('arbolForm');
  const bosque = document.getElementById('bosqueForm');
  if (metodo == 'Árboles') {
    arboles.style.display = 'block';
    bosque.style.display = 'none';
  } else if (metodo == 'Bosque') {
    arboles.style.display = 'none';
    bosque.style.display = 'block';
  }
})

function realizarPronosticoArbol() {
  console.log('===');
  $.ajax({
    type: 'POST',
    url: '/pronosticoArbol',
    data: {
      test: $('#testArbol').val(),
      y: $('#yarbol').val(),
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
    success: function (data) {
      let obj = JSON.parse(data);
      document.getElementById('X').innerHTML = obj['X'];
      document.getElementById('Y').innerHTML = obj['Y'];
      document.getElementById('Xtest').innerHTML = obj['Xtest'];
      document.getElementById('Ycomp').innerHTML = obj['Ycomp'];

      const predInfo = document.getElementById('predInfo');
      predInfo.append('\nScore: ' + obj['r2']);
      predInfo.append('\nCriterio: ' + obj['criterio']);
      //predInfo.append('Importancia: ' + obj['impVar']);
      predInfo.append('\nMAE: ' + obj['mae']);
      predInfo.append('\nMSE: ' + obj['mse']);
      predInfo.append('\nRMSE: ' + obj['rmse']);

      const predGraph = $('#predGraph');
      predGraph.append('<img src="data:image/png;base64,' + obj['uri'] + '">');
      const tree = $('#tree');
      tree.append('<img src="data:image/png;base64,' + obj['tree'] + '">');
    }
  });
}