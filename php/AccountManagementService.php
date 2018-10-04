<?php
include 'DBConnection.php';
include 'TokenGenerator.php';
include 'Constants.php';
use PermissionsConstants;
use TokenGenerator;
use Logger;

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);
$correlationId = $GLOBALS["CorrelationID"];
$GLOBALS["development"] = true;

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
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $query = 
            "SELECT *
            FROM citta";
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
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
        TokenGenerator::CheckPermissions(PermissionsConstants::PROPRIETARIO, "delega_codice");
        $id_citta = json_decode($_POST["id_citta"]); 
        $query = 
            "SELECT *
            FROM punto_vendita 
            %s";                    
        $query = sprintf($query, ($id_citta == -1 ? "" : sprintf("WHERE id_citta = %d", addslashes($id_citta)))); 
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
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
        TokenGenerator::CheckPermissions(PermissionsConstants::PROPRIETARIO, "delega_codice");
        $id_store = json_decode($_POST["id_punto_vendita"]); 
        $query = 
            "SELECT dip.id_dipendente, dip.nome as dipendente_nome, dip.cognome as dipendente_cognome,
                dip.username as dipendente_username, del.nome as delega_nome, del.codice as delega_codice,
                pv.nome as punto_vendita_nome, dip.id_punto_vendita as punto_vendita_id
            FROM dipendente as dip
            INNER JOIN delega as del
            ON dip.id_delega = del.id_delega
            INNER JOIN punto_vendita as pv
            ON dip.id_punto_vendita = pv.id_punto_vendita 
            %s";
        $query = sprintf($query, ($id_store == -1 ? "" : sprintf("WHERE dip.id_punto_vendita = %d", addslashes($id_store))));
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $employee = new Employee($row);
            $array[] = $employee;
        }
        exit(json_encode($array));
    }

    function DeleteEmployee() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::PROPRIETARIO, "delega_codice");
        $id_dipendente = $_POST["id_dipendente"]; 
        $query = 
            "DELETE FROM dipendente              
            WHERE id_dipendente = %d";
        $query = sprintf($query, $id_dipendente);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        if($res) {
            exit(json_encode($res));
        } else {
            http_response_code(500);
        }       
    }

    function InsertEmployee() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::PROPRIETARIO, "delega_codice");
        $dip = json_decode($_POST["dipendente"]); 
        $password = $GLOBALS["development"] ? "password" : uniqid();
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);     
        $query = 
            "INSERT INTO dipendente (id_delega, id_punto_vendita, nome, cognome, username, password)
            VALUES (%d, %d, '%s', '%s', '%s', '%s')";            
        $query = sprintf($query, 
                            $dip->id_delega, 
                            $dip->id_punto_vendita,
                            $dip->nome, 
                            $dip->cognome,  
                            $dip->username,
                            $hashedPassword);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        if($res) {
            exit(json_encode($res));
        } else {
            http_response_code(500);
        } 
    }

    function EditEmployee() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::PROPRIETARIO, "delega_codice");
        $dip = json_decode($_POST["dipendente"]); 
        $query = 
            "UPDATE dipendente
            SET 
            id_delega = %d,
            id_punto_vendita = %d,
            nome = '%s',
            cognome = '%s',
            username = '%s'
            WHERE `id_dipendente` = %d";
        $query = sprintf($query, 
                            $dip->id_delega, 
                            $dip->id_punto_vendita,
                            $dip->nome, 
                            $dip->cognome,  
                            $dip->username, 
                            $dip->id_dipendente);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        exit(json_encode($res));
    }

    function ResetPassword() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::PROPRIETARIO, "delega_codice");
        $id_dipendente = $_POST["id_dipendente"]; 
        $query = 
            "UPDATE dipendente
            SET password = '%s'                     
            WHERE id_dipendente = %d";
        $newPassword = uniqid();
        $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);       
        $query = sprintf($query, $hashedNewPassword, $id_dipendente);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        if($res) {
            exit(json_encode($newPassword));
        } else {
            http_response_code(500);
        }       
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
                case "deleteEmployee":
                    self::DeleteEmployee();
                    break;
                case "insertEmployee":
                    self::InsertEmployee();
                    break;
                case "editEmployee":
                    self::EditEmployee();
                    break;
                case "resetPassword":
                    self::ResetPassword();
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
    public $punto_vendita_id;
    public $punto_vendita_nome;

    public function __construct($row) {
        $this->dipendente_id = $row["id_dipendente"];
        $this->dipendente_nome = $row["dipendente_nome"];
        $this->dipendente_cognome = $row["dipendente_cognome"];
        $this->dipendente_username = $row["dipendente_username"];
        $this->delega_nome = $row["delega_nome"];
        $this->punto_vendita_nome = $row["punto_vendita_nome"];
        $this->punto_vendita_id = $row["punto_vendita_id"];
    }
}
?>