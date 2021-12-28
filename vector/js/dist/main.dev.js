"use strict";

/*
$.ajax({
    url: direcion,
    type: 'POST',
    dataType: 'JSON',
    data: {

    }
}).done(response => {

}).fail(err => {
    console.log('Error al ' + err.message);
})
*/
var direcion = "http://localhost/apps/llamadas_mesa/vector/controlador/controlador.php",
    btn_relacion = document.getElementsByClassName('btn-relac'),
    meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    hora,
    fecha; // cambio de pagina (llamadas, grupos y admin)

function btn_menu(dato) {
  // cambio de pagina (llamadas, grupos y admin
  switch (dato) {
    case 'llamadas':
      $('#conte-pantallas').css('left', '0%');
      break;

    case 'grupos':
      $('#conte-pantallas').css('left', '-100%');
      mostrarGrupos();
      break;

    case 'admin':
      $('#conte-pantallas').css('left', '-200%');
      break;
  }

  $('.btn-menu').addClass('text-info');
  $('#btn-' + dato).removeClass('text-info');
} // hoar y dia


function horaca(hora) {
  // obtiene la hora actual
  x = new Date(), h = x.getHours(), m = x.getMinutes();
  if (m.toString().length < 2) return hora = h + ":0" + m.toString();
  return hora = h + ':' + m;
}

function diaca(fecha) {
  // obtiene el dia actual
  var x = new Date(),
      d = x.getDate(),
      m = x.getMonth(),
      a = x.getFullYear();
  return fecha = d + '-' + meses[m] + '-' + a;
}
/******************************************************************************
 ************************  SERVIDOR *******************************************
 ******************************************************************************/


function empezarServidor() {
  // llena el select con los servidores
  $.ajax({
    url: direcion,
    type: 'POST',
    dataType: 'JSON',
    data: {
      accion: 'LLENARSERVI'
    }
  }).done(function (response) {
    var fila = '';
    fila += '<option value="ninguno" selected disabled>Seleciona un servidor</option>';
    $.each(response, function (index, data) {
      fila += '<option value="' + data.servidor + '">' + data.servidor + '</option>';
    });
    document.getElementById('serservidor').innerHTML = fila;
  }).fail(function (err) {
    console.log('Error al ' + err.message);
  });
  document.getElementById('serentrada').style.display = 'none';
  document.getElementById('serselecion').style.display = 'flex';
}

function selecionServidor() {
  // transicion del servidor
  document.getElementById('serselecion').style.display = 'none';
  document.getElementById('serfinal').style.display = 'flex';
  document.getElementById('servidor').innerHTML = document.getElementById('serservidor').value;
  document.getElementById('boton').style.display = 'block';
  document.getElementById('lado-derecho').style.display = 'block';
  document.getElementById('hora_entrada').value = horaca(hora);
  mostrarLlamada();
}

function finalServidor() {
  // envia datos servidor y cierra el servicio
  Swal.fire({
    title: 'Finalizar el servicio',
    text: "¿Ya as terminado tu servicio?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: "No, aun no",
    confirmButtonText: 'Si, ya e terminado'
  }).then(function (result) {
    if (result.isConfirmed) {
      $.ajax({
        url: direcion,
        type: 'POST',
        dataType: 'html',
        data: {
          accion: 'GUARDARSERVIDOR',
          entrada: document.getElementById('hora_entrada').value,
          salida: horaca(hora),
          dia: diaca(fecha),
          servidor: document.getElementById('serservidor').value
        }
      }).done(function (response) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '¡Hasta pronto!',
          text: "Felices 24 horas",
          showConfirmButton: false,
          timer: 3000
        });
        document.getElementById('serfinal').style.display = 'none';
        document.getElementById('serentrada').style.display = 'block';
        document.getElementById('boton').style.display = 'none';
        document.getElementById('lado-derecho').style.display = 'none';
      }).fail(function (err) {
        console.log('Error al guardar servidor ' + err);
      });
    }
  });
}
/******************************************************************************
 ************************  CREAR LLAMADA **************************************
 ******************************************************************************/


function crearLlamada() {
  // abre el formulario y llena los selects
  $.ajax({
    url: direcion,
    type: 'POST',
    dataType: 'JSON',
    data: {
      accion: 'RELLENARGRUPOS'
    }
  }).done(function (response) {
    var fila = '';
    fila += '<option value="" selected disabled>Seleciona un grupo</option>';
    $.each(response, function (index, data) {
      fila += '<option value="' + data.grupo + '">' + data.grupo + '</option>';
    });
    document.getElementById('grupo1').innerHTML = fila;
    document.getElementById('grupo2').innerHTML = fila;
  }).fail(function (err) {
    console.log('Error al ' + err.message);
  });
  document.getElementById('boton').style.display = 'none';
  document.getElementById('datosLlamada').style.display = 'block';
}

$('.btn-relac').on('click', function () {
  // animacion de los botones relacion
  var idd = $(this).attr('id');
  $('.btn-relac').attr('class', 'btn-relac btn btn-outline-primary');
  $(this).attr('class', 'btn-relac btn btn-primary');
  document.getElementById('relacionada').value = idd;

  if (idd == "NORMAL") {
    $('#asunto').slideUp();
  } else {
    $('#asunto').slideDown();
  }
});

function mandarLlamada() {
  // guarda la llamada
  $.ajax({
    url: direcion,
    type: 'POST',
    dataType: 'HTML',
    data: {
      accion: 'GUARDARLLAMADA',
      servidor: document.getElementById('serservidor').value,
      dia_llamada: diaca(fecha),
      hora_llamada: horaca(hora),
      llamado: document.getElementById('llamado').value,
      conocido: document.getElementById('conocido').value,
      descripcion: document.getElementById('txt-descripcion').value,
      relacionada: document.getElementById('relacionada').value,
      aviso: document.getElementById('aviso').value,
      grupo1: document.getElementById('grupo1').value,
      grupo2: document.getElementById('grupo2').value
    }
  }).done(function (response) {
    document.getElementById('datosLlamada').style.display = 'none';
    setTimeout(function () {
      document.getElementById('boton').style.display = 'block';
      limpiarLlamadas();
      mostrarLlamada();
    }, 1000);
  }).fail(function (err) {
    console.log('Error al guardar llamada' + err.message);
  });
}

function mostrarLlamada() {
  // muestra las llamadas del mismo servidor dia
  $.ajax({
    url: direcion,
    type: 'POST',
    dataType: 'JSON',
    data: {
      accion: 'MOSTRARLLAMADAS',
      llamada: diaca(fecha),
      servidor: document.getElementById('serservidor').value
    }
  }).done(function (response) {
    fila = '';
    $.each(response, function (index, data) {
      fila += '<tr>';
      fila += '<td><i class="fa fa-phone"></i></td>';
      fila += '<td class="datos">';
      fila += '<h6>Tipo llamada: <span>' + data.llamado + '</span></h6>';
      fila += '<div class="conte-ver">';
      fila += '<p><b>Nos a conocido: </b>' + data.conocido + '</p>';
      fila += '<p><b>Descripcion: </b>' + data.descripcion + '</p>';
      fila += '<p><b>Relacionada: </b>' + data.relacionada + '</p>';
      fila += '<p><b>Relacion: </b>' + data.aviso + '</p>';
      fila += '<p><b>Grupos Enviados: </b>' + data.grupos + '</p>';
      fila += '</div>';
      fila += '<p class="fecha">' + data.dia_llamada + ' / ' + data.hora_llamada + '</p>';
      fila += '</td></tr>';
    });
    fila += '<tr><td><span id="final"></span></td></tr>';
    document.getElementById('conte-llamadas').innerHTML = fila;
    document.getElementById('turno').className = "btn btn-primary";
    document.getElementById('hoy').className = "btn btn-outline-danger";
    document.getElementById('final').scrollIntoView(true);
  }).fail(function (err) {
    console.log('Error al llenar llamadas turno ' + err.message);
  });
}

function mostrarLlamadaTotal() {
  // muestra rodas las llamads del mismo dia
  $.ajax({
    url: direcion,
    type: 'POST',
    dataType: 'JSON',
    data: {
      accion: 'MOSTRARLLAMADASDIA',
      dia_llamada: diaca(fecha)
    }
  }).done(function (response) {
    fila = '';
    $.each(response, function (index, data) {
      fila += '<tr>';
      fila += '<td><i class="fa fa-phone"></i></td>';
      fila += '<td class="datos">';
      fila += '<h6>Tipo llamada: <span>' + data.llamado + '</span></h6>';
      fila += '<div class="conte-ver">';
      fila += '<p><b>Nos a conocido: </b>' + data.conocido + '</p>';
      fila += '<p><b>Descripcion: </b>' + data.descripcion + '</p>';
      fila += '<p><b>Relacionada: </b>' + data.relacionada + '</p>';
      fila += '<p><b>Relacion: </b>' + data.aviso + '</p>';
      fila += '<p><b>Grupos Enviados: </b>' + data.grupos + '</p>';
      fila += '</div>';
      fila += '<p class="fecha">' + data.dia_llamada + ' / ' + data.hora_llamada + '</p>';
      fila += '</td></tr>';
    });
    fila += '<tr><td><span id="final"></span></td></tr>';
    document.getElementById('conte-llamadas').innerHTML = fila;
    document.getElementById('turno').className = "btn btn-outline-danger";
    document.getElementById('hoy').className = "btn btn-primary";
    document.getElementById('final').scrollIntoView(true);
  }).fail(function (err) {
    console.log('Error al llenar llamadas total ' + err.message);
  });
}

function cancelarLlamada() {
  document.getElementById('datosLlamada').style.display = 'none';
  limpiarLlamadas();
  setTimeout(function () {
    document.getElementById('boton').style.display = 'block';
  }, 1000);
} // funciones extras


function limpiarLlamadas() {
  // limpia el formuklario de llamadas
  document.getElementById('llamado').value = "1";
  document.getElementById('conocido').value = "1";
  document.getElementById('txt-descripcion').value = "";
  $('.btn-relac').attr('class', 'btn-relac btn btn-outline-primary');
  $('#NORMAL').attr('class', 'btn-relac btn btn-primary');
  document.getElementById('relacionada').value = 'NORMAL';
  $('#asunto').slideUp();
  document.getElementById('aviso').innerHTML = "";
  document.getElementById('grupo1').value = "";
  document.getElementById('grupo2').value = "";
} // animacion llamadas


$(function () {
  $('#tabla-llamadas #conte-llamadas').on('click', 'tr>.datos', function () {
    // animacion de las llamadas
    var aa = $(this),
        bb = aa.children('.conte-ver'),
        cc = aa.parent().siblings().find('.conte-ver');
    bb.slideToggle();
    cc.slideUp();
  });
});
/******************************************************************************
 ************************  VER GRUPOS *****************************************
 ******************************************************************************/

function mostrarGrupos() {
  $.ajax({
    url: direcion,
    type: 'POST',
    dataType: 'json',
    data: {
      accion: 'RELLENARGRUPOS'
    }
  }).done(function (response) {
    var fila = '',
        nombre = '';
    nombre += '<option value="" selected disabled>Selecciona un grupo</option>';
    $.each(response, function (index, data) {
      nombre += '<option value="' + data.grupo + '">Grupo ' + data.grupo + '</option><br>';
      var nom = new String(data.grupo);
      fila += "<tr onclick=\"verDato('" + data.grupo + "')\">";
      fila += '<td>' + data.grupo + '</td>';
      fila += '<td>' + data.direcion + '</td>';
      fila += '<td>' + data.local + '</td>';
      fila += '<td>' + data.zona + '</td>';
      fila += '<td>' + data.ciudad + '</td>';
      fila += '<td>' + data.codpos + '</td>';
      fila += '<td>' + data.cerradas + '</td>';
      fila += '<td>' + data.abiertas + '</td>';
      fila += '<td>' + data.online + '</td>';
      fila += '</tr>';
    });
    document.getElementById('selgru').innerHTML = nombre;
    document.getElementById('tabla-grupos').innerHTML = fila;
  }).fail(function (err) {
    console.log('Error al mostrar grupos ' + err.message);
  });
}

function mostrarDatosGrupos() {
  var grupo = document.getElementById('selgru').value,
      fila = '',
      dato = '',
      paso = '';
  console.log(grupo);
  $.ajax({
    url: direcion,
    type: 'POST',
    dataType: 'JSON',
    data: {
      accion: 'DATOSGRUPO',
      grupo: grupo
    }
  }).done(function (response) {
    console.log(response);
    $.each(response, function (index, data) {
      fila += '<thead><th></th><th>LUN</th><th>MAR</th><th>MIE</th><th>JUE</th><th>VIE</th><th>SAB</th><th>DOM</th></thead>';
      fila += '<tbody>';
      fila += '<tr><td>mañana</td><td>' + data.lm + '</td><td>' + data.mm + '</td><td>' + data.xm + '</td><td>' + data.jm + '</td><td>' + data.vm + '</td><td>' + data.sm + '</td><td>' + data.dm + '</td></tr>';
      fila += '<tr><td>tarde</td><td>' + data.lt + '</td><td>' + data.mt + '</td><td>' + data.xt + '</td><td>' + data.jt + '</td><td>' + data.vt + '</td><td>' + data.st + '</td><td>' + data.dt + '</td></tr>';
      fila += '</tbody>';
      fila += '<tr><td>online</td><td>' + data.lo + '</td><td>' + data.mo + '</td><td>' + data.xo + '</td><td>' + data.jo + '</td><td>' + data.vo + '</td><td>' + data.so + '</td><td>' + data["do"] + '</td></tr>';
      dato += '<p><b>Direccion: </b>' + data.direcion + '<br><b>Local: </b>' + data.local + '<br><b>Municipio: </b>' + data.zona + '<br><b>Codigo postal: </b>' + data.codpos + ' - ' + data.ciudad + '</p>';
      paso += '<p><b>Reuniones abiertas: </b>' + data.abiertas + '<br><b>PASO XII: </b>los teléfonos no se dan a nadie.<br>' + data.servidor1 + '<br>' + data.servidor2 + '<br>' + data.servidor3 + '<br><center><button class="btn btn-secondary" onclick="borrarDatos()">Restablecer</button></center></p>';
    });
    document.getElementById('horarios').innerHTML = fila;
    $('#horarios tbody>tr').find('td:not(:first-child):contains("a")').css('background-color', '#fff');
    document.getElementById('direcion').innerHTML = dato;
    document.getElementById('paso').innerHTML = paso;
  }).fail(function (err) {
    console.log('Error al cargar el grupo ' + err.message);
  });
}

function borrarDatos() {
  // borrar elementos de grupos
  document.getElementById('selgru').value = "";
  document.getElementById('horarios').innerHTML = "";
  document.getElementById('direcion').innerHTML = "";
  document.getElementById('paso').innerHTML = ""; //document.getElementById('buscador').value = ""
}

function mostrarBuscador() {
  var buscar = document.getElementById('buscador').value.toUpperCase();
  console.log(buscar);

  if (buscar != "") {
    $('#tabla-grupos tbody>tr').css('display', 'none');
    $('#tabla-grupos tbody>tr').find('td:contains(' + buscar + ')').parent().css('display', 'block');
  } else {
    $('#tabla-grupos tbody>tr').css('display', 'none');
  }
}

function verDato(dato) {
  var datos = new String(dato);
  console.log(datos);
  document.getElementById('selgru').value = dato;
  mostrarDatosGrupos();
}