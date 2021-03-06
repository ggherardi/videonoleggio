<?php
include 'DBConnection.php';
include 'TokenGenerator.php';
include 'Constants.php';
use PermissionsConstants;
use TokenGenerator;
use Logger;

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);
$correlationId = $GLOBALS["CorrelationID"];

class GetAllItemsService {

    function __construct() { }

    /** Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection */
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    function GetAllCities() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $query = 
            "SELECT *
            FROM citta";
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $array[] = $row;
        }
        exit(json_encode($array));
    }

    function GetAllStores() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::PROPRIETARIO, "delega_codice");
        $query = 
            "SELECT *
            FROM punto_vendita"; 
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $array[] = $row;
        }
        exit(json_encode($array));
    }

    function GetAllEmployees() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::PROPRIETARIO, "delega_codice");
        $query = 
            "SELECT *
            FROM dipendente";
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $array[] = $row;
        }
        exit(json_encode($array));
    }

    function GetAllRoles() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::PROPRIETARIO, "delega_codice");
        $query = 
            "SELECT *
            FROM delega";
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $array[] = $row;
        }
        exit(json_encode($array));
    }

    function GetAllFilms() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $query = 
            "SELECT *
            FROM film";
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $array[] = $row;
        }
        exit(json_encode($array));
    }

    function GetAllSuppliers() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $query = 
            "SELECT *
            FROM fornitore";
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $array[] = $row;
        }
        exit(json_encode($array));
    }

    function GetAllCustomers() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $query = 
            "SELECT *
            FROM cliente";
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $array[] = $row;
        }
        exit(json_encode($array));
    }

    function GetAllDiscounts() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $query = 
            "SELECT *
            FROM fidelizzazione";
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $array[] = $row;
        }
        exit(json_encode($array));
    }

    function GetAllSettings() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::PROPRIETARIO, "delega_codice");
        $query = 
            "SELECT *
            FROM impostazione";
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $array[] = $row;
        }
        exit(json_encode($array));
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        try {
            switch($_POST["action"]) {
                case "getAllCities":
                    self::GetAllCities();
                break;
                case "getAllStores":
                    self::GetAllStores();
                    break;
                case "getAllEmployees":
                    self::GetAllEmployees();
                    break;
                case "getAllRoles":
                    self::GetAllRoles();
                    break;
                case "getAllFilms":
                    self::GetAllFilms();
                    break;
                case "getAllSuppliers":
                    self::GetAllSuppliers();
                    break;
                case "getAllCustomers":
                    self::GetAllCustomers();
                    break;
                case "getAllDiscounts":
                    self::GetAllDiscounts();
                    break;
                case "getAllSettings":
                    self::GetAllSettings();
                    break;
                default: 
                    exit(json_encode($_POST));
                    break;
            }
        }
        catch(Throwable $ex) {
            Logger::Write("Error occured -> $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
        }
    }
}

// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
try {
    Logger::Write("Reached GetAllItemsService API", $GLOBALS["CorrelationID"]);    
    $Auth = new GetAllItemsService();
    $Auth->Init();
}
catch(Throwable $ex) {
    Logger::Write("Error occured: $ex", $GLOBALS["CorrelationID"]);
    http_response_code(500);
    exit(json_encode($ex->getMessage()));
}
?>