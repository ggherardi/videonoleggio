<?php
include 'DBConnection.php';
include 'TokenGenerator.php';
use TokenGenerator;
use Logger;

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);
$correlationId = $GLOBALS["CorrelationID"];
$development = true;

class StorageManagementService {

    function __construct() { }

    /** Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection */
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    function GetVideosInStorage() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::ValidateToken();
        $filters = json_decode($_POST["filters"]);
        $query = 
            "SELECT co.id_copia, co.data_scarico, co.danneggiato, co.noleggiato, fi.id_film, fi.titolo, fo.nome
            FROM copia co
            INNER JOIN film fi
            ON co.id_film = fi.id_film
            INNER JOIN fornitore fo
            ON co.id_fornitore = fo.id_fornitore
            WHERE co.id_punto_vendita = %d
            AND co.restituito = 0";
        $query = sprintf($query, $filters->id_punto_vendita);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $copy = new Copy($row);
            $array[] = $copy;
        }
        exit(json_encode($array));
    }

    function GetComingSoonMovies() {

    }

    function GetAlreadyAvailableMovies() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::ValidateToken();
        $query = 
            "SELECT *
            FROM film
            WHERE inUscita = 0";
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $array[] = $row;
        }
        exit(json_encode($array));
    }

    function UnloadCopies() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::ValidateToken();
        $copies = json_decode($_POST["copies"]);
        $query = 
            "INSERT INTO copia
            (id_film, id_punto_vendita, id_fornitore)
            VALUES ";
        for($i = 0; $i < $copies->numberOfCopies; $i++) {
            $query .= sprintf("(%d, %d, %d), ", $copies->id_film, $copies->id_punto_vendita, $copies->id_fornitore);
        }
        $query = rtrim($query);
        $query = rtrim($query, ",");
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        if($res) {
            exit(json_encode($res));
        } else {
            http_response_code(500);
        } 
    }

    function LoadCopies() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::ValidateToken();
        $copies = json_decode($_POST["copies"]);
        $query = 
            "UPDATE copia
            SET restituito = 1
            WHERE id_copia in (%s)";
        $idsString = "";
        for($i = 0; $i < count($copies); $i++) {
            $idsString .= sprintf("%d, ", $copies[$i]);
        }
        $idsString = rtrim($idsString);
        $idsString = rtrim($idsString, ",");
        $query = sprintf($query, $idsString);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        if($res) {
            exit(json_encode($res));
        } else {
            http_response_code(500);
        } 
    }


    // Switcha l'operazione richiesta lato client
    function Init() {
        try {
            switch($_POST["action"]) {
                case "getVideosInStorage":
                    self::GetVideosInStorage();
                    break;
                case "getAlreadyAvailableMovies":
                    self::GetAlreadyAvailableMovies();
                    break;
                case "unloadCopies":
                    self::UnloadCopies();
                    break;
                case "loadCopies":
                    self::LoadCopies();
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
    Logger::Write("Reached StorageManagementService API", $GLOBALS["CorrelationID"]);    
    $Auth = new StorageManagementService();
    $Auth->Init();
}
catch(Throwable $ex) {
    Logger::Write("Error occured: $ex", $GLOBALS["CorrelationID"]);
    http_response_code(500);
    exit(json_encode($ex->getMessage()));
}

class Copy {
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