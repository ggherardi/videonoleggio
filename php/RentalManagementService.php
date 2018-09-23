<?php
include 'DBConnection.php';
include 'TokenGenerator.php';
include 'Constants.php';
use PermissionsConstants;
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
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
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
        exit(json_encode($videosArray));
    }

    function SortByFilmId($a, $b) {
        return $a->id_film > $b->id_film;
    }

    function GetMostRecentCopies() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $allCopies = array();
        try {
            $filters = json_decode($_POST["filters"]);
            $this->dbContext->StartTransaction();
            for($i = 0; $i < count($filters->films); $i++) {
                Logger::Write("FILTERS: ".json_encode($filters->films[$i]->id_film), $GLOBALS["CorrelationID"]);
                $query = 
                    "SELECT co.id_copia, co.data_scarico, co.id_film
                    FROM copia co
                    WHERE co.id_punto_vendita = %d
                    AND co.id_film = %d
                    AND co.noleggiato = 0
                    AND co.restituito = 0
                    ORDER BY co.data_scarico desc
                    LIMIT 1";
                $query = sprintf($query, $filters->id_punto_vendita, $filters->films[$i]->id_film);
                // Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
                $res = self::ExecuteQuery($query);
                // Logger::Write("ROW: ".json_encode($row), $GLOBALS["CorrelationID"]);
                $row = $res->fetch_assoc();
                $allCopies[] = $row;
                $query = 
                    "UPDATE copia             
                    SET
                    noleggiato = 1,
                    data_prenotazione_noleggio = CURRENT_TIMESTAMP,
                    id_dipendente_prenotazione_noleggio = %d
                    WHERE id_copia = %d
                    AND noleggiato = 0
                    AND restituito = 0";
                $query = sprintf($query, $filters->id_dipendente, $row["id_copia"]);
                // Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
                $res = self::ExecuteQuery($query);
            }
            $this->dbContext->CommitTransaction();
        } catch (Throwable $ex) {
            $this->dbContext->RollBack();
            http_response_code(500);
        }

        exit(json_encode($allCopies));
    }

/////// Per sicurezza, mettere il controllo che il video sia prenotato dall'user che sta confermando il noleggio, onde evitare problematiche

    function ClearRentalBookings() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $query = 
            "CALL clearAllExpiredTempRent()";
        $res = self::ExecuteQuery($query);
        exit(json_encode($res));
    }

    function ClearRentalBookingsForUser() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $id_dipendente = $_POST["id_dipendente"];
        $query = 
            "CALL clearAllExpiredTempRentForUser(%d)";
        $query = sprintf($query, $id_dipendente);
        $res = self::ExecuteQuery($query);
        exit(json_encode($res));
    }

    function GetActiveDiscount() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $query = 
            "SELECT id_tariffa, tariffa
            FROM tariffa
            WHERE attiva = 1"; 
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $row = $res->fetch_assoc();
        exit(json_encode($row));
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        try {
            $this->dbContext = new DBConnection();
            switch($_POST["action"]) {
                case "getVideosInStorageWithCount":
                    self::GetVideosInStorageWithCount();
                    break;
                case "getMostRecentCopies":
                    self::GetMostRecentCopies();
                    break;
                case "clearRentalBookings":
                    self::ClearRentalBookings();
                    break;
                case "clearRentalBookingsForUser":
                    self::ClearRentalBookingsForUser();
                    break;
                case "getActiveDiscount":
                    self::GetActiveDiscount();
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