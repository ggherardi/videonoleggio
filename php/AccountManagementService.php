<?php
include 'DBConnection.php';
include 'TokenGenerator.php';
use TokenGenerator;
use Logger;

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);
$correlationId = $GLOBALS["CorrelationID"];

class AccountManagementService {

    function __construct() { }

    /** Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection */
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    function GetCities() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::ValidateToken();
        $query = 
            "SELECT *
            FROM citta";
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $city = new City($row);
            $array[] = $city;
        }
        exit(json_encode($array));
    }

    function GetStores() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::ValidateToken();
        $id_citta = json_decode($_POST["id_citta"]); 
        $query = 
            "SELECT *
            FROM punto_vendita
            WHERE id_citta = %d";
        $query = sprintf($query, addslashes($id_citta));
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $store = new Store($row);
            $array[] = $store;
        }
        exit(json_encode($array));
    }

    function GetEmployees() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::ValidateToken();
        $id_citta = json_decode($_POST["id_punto_vendita"]); 
        $query = 
            "SELECT dip.id_dipendente, dip.nome as dipendente_nome, dip.cognome as dipendente_cognome,
                dip.username as dipendente_username, del.nome as delega_nome, del.codice as delega_codice
            FROM dipendente dip
            INNER JOIN delega del
            ON dip.id_delega = del.id_delega
            WHERE id_punto_vendita = %d";
        $query = sprintf($query, addslashes($id_citta));
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $employee = new Employee($row);
            $array[] = $employee;
        }
        exit(json_encode($array));
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        try {
            switch($_POST["action"]) {
                case "getCities":
                    self::GetCities();
                break;
                case "getStores":
                    self::GetStores();
                    break;
                case "getEmployees":
                    self::GetEmployees();
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
    Logger::Write("Reached AccountManagementService API", $GLOBALS["CorrelationID"]);    
    $Auth = new AccountManagementService();
    $Auth->Init();
}
catch(Throwable $ex) {
    Logger::Write("Error occured: $ex", $GLOBALS["CorrelationID"]);
    http_response_code(500);
    exit(json_encode($ex->getMessage()));
}

class City {
    public $citta_id;
    public $citta_nome;

    public function __construct($row) {
        $this->citta_id = $row["id_citta"];
        $this->citta_nome = $row["nome"];
    }
}

class Store {
    public $punto_vendita_id;
    public $punto_vendita_nome;
    public $punto_vendita_indirizzo;
    public $punto_vendita_id_citta;

    public function __construct($row) {
        $this->punto_vendita_id = $row["id_punto_vendita"];
        $this->punto_vendita_nome = $row["nome"];
        $this->punto_vendita_indirizzo = $row["indirizzo"];
        $this->punto_vendita_id_citta = $row["id_citta"];
    }
}

class Employee {
    public $dipendente_id;
    public $dipendente_nome;
    public $dipendente_cognome;
    public $dipendente_username;
    public $delega_nome;
    public $delega_codice;

    public function __construct($row) {
        $this->dipendente_id = $row["id_dipendente"];
        $this->dipendente_nome = $row["dipendente_nome"];
        $this->dipendente_cognome = $row["dipendente_cognome"];
        $this->dipendente_username = $row["dipendente_username"];
        $this->delega_nome = $row["delega_nome"];
        $this->dipendente_username = $row["delega_codice"];
    }
}
?>