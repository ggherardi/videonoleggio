<?php
include 'DBConnection.php';
include 'TokenGenerator.php';
use TokenGenerator;
use Logger;

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);
$correlationId = $GLOBALS["CorrelationID"];
$development = true;

class RentalManagementService {

    function __construct() { }

    /** Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection */
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    function GetVideosInStorageWithCount() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::ValidateToken();
        $filters = json_decode($_POST["filters"]);
        $query = 
            "SELECT fi.id_film, fi.titolo, fi.durata, fi.prezzo_giornaliero,
                    ge.tipo, cp.nome as casa_produttrice_nome, re.nome as regista_nome, re.cognome as regista_cognome,
                    count(*) as copie_totali, SUM(co.noleggiato) as copie_noleggiate, SUM(co.danneggiato) as copie_danneggiate
            FROM copia co
            INNER JOIN film fi
            ON co.id_film = fi.id_film
            INNER JOIN genere ge
            ON fi.id_genere = ge.id_genere
            INNER JOIN casa_produttrice cp
            ON fi.id_casa_produttrice = cp.id_casa_produttrice
            INNER JOIN regista re
            ON fi.id_regista = re.id_regista            
            WHERE co.id_punto_vendita = %d
            AND co.restituito = 0
            GROUP BY fi.id_film";
        $query = sprintf($query, $filters->id_punto_vendita);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $videosArray = array();
        while($row = $res->fetch_assoc()){
            // $video = new Video($row);
            $videosArray[] = $row;
        }
        usort($videosArray, "SortByFilmId");        
        $query = 
            "SELECT ca.id_film, at.nome as attore_nome, at.cognome as attore_cognome                    
            FROM cast ca
            INNER JOIN attore at
            ON ca.id_attore = at.id_attore
            WHERE ca.id_film         
            IN (%s)";
        $idsString = "";
        for($i = 0; $i < count($videosArray); $i++) {            
            $idsString .= sprintf("%d, ", $videosArray[$i]["id_film"]);
        }
        $idsString = rtrim($idsString);
        $idsString = rtrim($idsString, ",");
        $query = sprintf($query, $idsString);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $actorsArrays = array();
        while($row = $res->fetch_assoc()){
            for($i = 0; $i < count($videosArray); $i++) {              
                if($videosArray[$i]["id_film"] == $row["id_film"]) {    
                    $actor = new Actor($row);                                
                    $videosArray[$i]["cast"][] = $actor;
                    break;
                }            
            }
        }
        Logger::Write("Actor: ".json_encode($videosArray), $GLOBALS["CorrelationID"]);    
        exit(json_encode($videosArray));
    }

    function SortByFilmId($a, $b) {
        return $a->id_film > $b->id_film;
    }

    function GetMostRecentCopies() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::ValidateToken();
        $filters = json_decode($_POST["filters"]);
        $dbContext->StartTransaction();
        $query = 
            "LOCK TABLES videonoleggo.copia WRITE;
            SELECT * FROM videonoleggio.copia
            WHERE id_punto_vendita = %d
            AND id_film = 12
            AND noleggiato = 0
            AND restituito = 0
            ORDER BY data_scarico desc
            LIMIT 1";
        $query = sprintf($query, $filters->id_punto_vendita);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $videosArray = array();
        while($row = $res->fetch_assoc()){
            // $video = new Video($row);
            $videosArray[] = $row;
        }
        $dbContext->CommitTransaction();
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        try {
            switch($_POST["action"]) {
                case "getVideosInStorageWithCount":
                    self::GetVideosInStorageWithCount();
                    break;
                case "getMostRecentCopies":
                    self::GetMostRecentCopies();
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
    Logger::Write("Reached RentalManagementService API", $GLOBALS["CorrelationID"]);    
    $Auth = new RentalManagementService();
    $Auth->Init();
}
catch(Throwable $ex) {
    Logger::Write("Error occured: $ex", $GLOBALS["CorrelationID"]);
    http_response_code(500);
    exit(json_encode($ex->getMessage()));
}

class Cast {
    public $id_film;
    public $actor;

    function __construct($row) {
        $this->id_film = $row->id_film;
        $this->actor = new Actor($row);
    }
}

class Actor {
    public $nome_attore;
    public $cognome_attore;

    function __construct($row) {
        $this->nome_attore = $row["attore_nome"];
        $this->cognome_attore = $row["attore_cognome"];
    }
}
?>