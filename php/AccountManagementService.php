<?php
include 'PHPConst.php';
include 'DBConnection.php';
include 'models\Models.php';
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
        Logger::Write("Processing request.", $GLOBALS["CorrelationID"]);
        exit(json_encode("works"));
    }

    function GetStores() {
        Logger::Write("Processing request.", $GLOBALS["CorrelationID"]);
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        switch($_POST["action"]) {
            case "getCities":
                self::GetCities();
            break;
            case "getStores":
                self::GetStores();
                break;
            default: 
                echo json_encode($_POST);
                break;
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
?>