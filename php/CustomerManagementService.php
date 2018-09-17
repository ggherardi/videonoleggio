<?php
include 'DBConnection.php';
include 'TokenGenerator.php';
use TokenGenerator;
use Logger;

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);
$correlationId = $GLOBALS["CorrelationID"];
$development = true;

class CustomerManagementService {

    function __construct() { }

    /** Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection */
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    function GetAllCustomersWithPremiumCode() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::ValidateToken();
        $query = 
            "SELECT *
            FROM cliente
            INNER JOIN fidelizzazione
            on cliente.id_fidelizzazione = fidelizzazione.id_fidelizzazione";
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            if(strlen($row["liberatoria"]) > 0) {
                $blob = $row["liberatoria"];
                $encoded64Blob = base64_encode("$blob");
                $row["liberatoria"] = $encoded64Blob;
            }
            $array[] = $row;
        }
        header("Content-Type: application/pdf");
        exit(json_encode($array));
    }

    function InsertNewCustomer() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::ValidateToken();
        if(count($_FILES) > 0) {
            $fileData = self::GetFileData();
        }
        $query = 
            "INSERT INTO cliente
            (liberatoria, id_fidelizzazione)
            VALUES
            (%s, %d)";
        $query = sprintf($query, ($fileData != null ? "'$fileData'" : "DEFAULT"), 1);
        Logger::Write("query: " .$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        if($res) {
            exit(json_encode("Success!"));
        } else {
            http_response_code(500);
        }
    }

    private function GetFileData() {
        $filename = $_FILES['file']['tmp_name'];
        $file = readfile($_FILES['file']['tmp_name']);
        $filePointer = fopen($_FILES['file']['tmp_name'], 'rb');
        $fileData = fread($filePointer, filesize($_FILES['file']['tmp_name']));
        $fileData = addslashes($fileData);
        return $fileData;
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        try {
            switch($_POST["action"]) {
                case "getAllCustomersWithPremiumCode":
                    self::GetAllCustomersWithPremiumCode();
                    break;
                case "insertNewCustomer":
                    self::InsertNewCustomer();
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
    Logger::Write("Reached CustomerManagementService API", $GLOBALS["CorrelationID"]);    
    $Auth = new CustomerManagementService();
    $Auth->Init();
}
catch(Throwable $ex) {
    Logger::Write("Error occured: $ex", $GLOBALS["CorrelationID"]);
    http_response_code(500);
    exit(json_encode($ex->getMessage()));
}

class Customer {
    public $id_copia;
    public $id_film;
    public $titolo;  
    public $fornitore;  
    public $data_scarico;
    public $danneggiato;
    public $noleggiato;  

    function __construct($row) {
        $this->id_copia = $row["id_copia"];
        $this->id_film = $row["id_film"];
        $this->titolo = $row["titolo"];
        $this->fornitore = $row["nome"];
        $this->data_scarico = $row["data_scarico"];
        $this->danneggiato = $row["danneggiato"];
        $this->noleggiato = $row["noleggiato"];        
    }
}
?>