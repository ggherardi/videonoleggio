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

class RestitutionManagementService {
    function __construct() { }
    /** Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection */
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    function GetRentedVideoForUser() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $filters = json_decode($_POST["filters"]);
        $query = 
            "SELECT co.id_copia, co.data_inizio, co.data_fine, co.prezzo_totale, ta.tariffa,
                    fi.titolo
            FROM noleggio no
            INNER JOIN copia co
            ON no.id_copia = co.id_copia
            INNER JOIN film fi
            ON co.id_film = fi.id_film
            INNER JOIN tariffa ta
            ON co.id_tariffa = ta.id_tariffa
            WHERE co.id_punto_vendita = %d
            AND no.id_cliente = %d";
        $query = sprintf($query, $filters->id_punto_vendita, $filters->id_cliente);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $copiesArray = array();
        while($row = $res->fetch_assoc()){
            $copiesArray[] = $row;
        }
        exit(json_encode($copiesArray));
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        try {
            $this->dbContext = new DBConnection();
            switch($_POST["action"]) {
                case "getRentedVideoForUser":
                    self::GetRentedVideoForUser();
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
    Logger::Write("Reached RestitutionManagementService API", $GLOBALS["CorrelationID"]);    
    $Auth = new RestitutionManagementService();
    $Auth->Init();
}
catch(Throwable $ex) {
    Logger::Write("Error occured: $ex", $GLOBALS["CorrelationID"]);
    http_response_code(500);
    exit(json_encode($ex->getMessage()));
}
?>