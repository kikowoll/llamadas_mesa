<?php

require "CORS.php";
require "../modelo/modelo.php";

if($_POST) {
    $modelo = new Modelo();
    $accion = $_POST['accion'];

    switch($accion) {
        case "LLENARSERVI":
            echo json_encode($modelo->LLENARSERVIDORES());
            break;
        case "GUARDARSERVIDOR":
            $servidor = $_POST['servidor'];
            $hora_entrada = $_POST['entrada'];
            $hora_salida = $_POST['salida'];
            $dia_servicio = $_POST['dia'];

            echo json_encode($modelo->GUARDARSERVIDORES($servidor,$dia_servicio,$hora_entrada,$hora_salida));
            break;
        case "RELLENARGRUPOS":
            echo json_encode($modelo->RELLENARGRUPOS());
            break;
        case 'GUARDARLLAMADA':
            $servidor = $_POST['servidor'];
            $hora_llamada = $_POST['hora_llamada'];
            $dia_llamada = $_POST['dia_llamada'];
            $llamado = $_POST['llamado'];
            $conocido = $_POST['conocido'];
            $descripcion = $_POST['descripcion'];
            $relacionada = $_POST['relacionada'];
            $aviso = $_POST['aviso'];
            $grupos = $_POST['grupo1'] . ', ' .$_POST['grupo2'];

            echo json_encode($modelo->GUARDARLLAMADA($servidor,$hora_llamada,$dia_llamada,$llamado,$conocido,$descripcion,$relacionada,$aviso,$grupos));
            break;
        case 'MOSTRARLLAMADAS':
            $dia_llamada = $_POST['llamada'];
            $servidor = $_POST['servidor'];

            echo json_encode($modelo->MOSTRARLLAMADAS($dia_llamada,$servidor));
            break;
        case 'MOSTRARLLAMADASDIA':
            $dia_llamada = $_POST['dia_llamada'];

            echo json_encode($modelo->MOSTRARLLAMADASDIA($dia_llamada));
            break;
        case 'DATOSGRUPO':
            $grupo = $_POST['grupo'];
            echo json_encode($modelo->DATOSGRUPO($grupo));
            break;
    }
}