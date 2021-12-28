<?php

class Conexion extends PDO {
    public function __construct() {
        try{
            parent::__construct("mysql:host=localhost;dbname=llamadas_mesa", "root", "");
            parent::exec("set names utf8");
        }catch(PDOException $e) {
            echo "Error al conectar" . $e.getMessage();
            exit;
        }
    }

}
