<?php

require 'config.php';

class Modelo {
    public function LLENARSERVIDORES() { // llena el select de servidores
        $conexion = new Conexion();
        $stmt = $conexion->prepare("SELECT * FROM servidores");

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function GUARDARSERVIDORES($servidor,$dia_servicio,$hora_entrada,$hora_salida) { // guarda el servidor
        $conexion = new Conexion();
        $stmt = $conexion->prepare("INSERT INTO servidores_ser (servidor,dia_servicio,hora_entrada,hora_salida) VALUES (:servidor,:dia_servicio,:hora_entrada,:hora_salida)");

        $stmt->bindValue(":servidor", $servidor, PDO::PARAM_STR);
        $stmt->bindValue(":dia_servicio", $dia_servicio, PDO::PARAM_STR);
        $stmt->bindValue(":hora_entrada", $hora_entrada, PDO::PARAM_STR);
        $stmt->bindValue(":hora_salida", $hora_salida, PDO::PARAM_STR);

        $stmt->execute();
        return 1;
    }

    public function RELLENARGRUPOS() { // rellena select grupos
        $conexion = new Conexion();
        $stmt = $conexion->prepare("SELECT * FROM grupos ORDER BY grupo ASC");

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function GUARDARLLAMADA($servidor,$hora_llamada,$dia_llamada,$llamado,$conocido,$descripcion,$relacionada,$aviso,$grupos) { // guarda la llamada
        $conexion = new Conexion();
        $stmt = $conexion->prepare("INSERT INTO  llamadas (servidor,hora_llamada,dia_llamada,llamado,conocido,descripcion,relacionada,aviso,grupos) VALUES (:servidor,:hora_llamada,:dia_llamada,:llamado,:conocido,:descripcion,:relacionada,:aviso,:grupos)");

        $stmt->bindValue(":servidor", $servidor, PDO::PARAM_STR);
        $stmt->bindValue(":hora_llamada", $hora_llamada, PDO::PARAM_STR);
        $stmt->bindValue(":dia_llamada", $dia_llamada, PDO::PARAM_STR);
        $stmt->bindValue(":llamado", $llamado, PDO::PARAM_STR);
        $stmt->bindValue(":conocido", $conocido, PDO::PARAM_STR);
        $stmt->bindValue(":descripcion", $descripcion, PDO::PARAM_STR);
        $stmt->bindValue(":relacionada", $relacionada, PDO::PARAM_STR);
        $stmt->bindValue(":aviso", $aviso, PDO::PARAM_STR);
        $stmt->bindValue(":grupos", $grupos, PDO::PARAM_STR);

        $stmt->execute();
        return;

    }

    public function MOSTRARLLAMADAS($dia_llamada,$servidor) { // muestra las llamadas de l seervidor 
        $conexion = new Conexion();
        $stmt = $conexion->prepare("SELECT * FROM llamadas WHERE dia_llamada = :dia_llamada AND servidor = :servidor");

        $stmt->bindValue(":dia_llamada", $dia_llamada, PDO::PARAM_STR);
        $stmt->bindValue(":servidor", $servidor, PDO::PARAM_STR);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function MOSTRARLLAMADASDIA($dia_llamada){ // muestra las llamadas del dia
        $conexion = new Conexion();
        $stmt = $conexion->prepare("SELECT * FROM llamadas WHERE dia_llamada = :dia_llamada");

        $stmt->bindValue(":dia_llamada", $dia_llamada, PDO::PARAM_STR);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function DATOSGRUPO($grupo) { // muestra los datos del grupo que selecionamos en grupos
        $conexion = new Conexion();
        $stmt = $conexion->prepare("SELECT * FROM grupos WHERE grupo = :grupo");

        $stmt->bindValue(":grupo", $grupo, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
}