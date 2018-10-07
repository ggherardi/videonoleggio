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
            "SELECT co.id_copia, no.id_noleggio, no.data_inizio, no.data_fine, no.prezzo_totale, fi.titolo,
                cli.nome, cli.cognome, cli.id_cliente, pd.prezzo_giornaliero, pd.tariffa, pd.percentuale
            FROM noleggio no
            INNER JOIN cliente cli
            ON no.id_cliente = cli.id_cliente
            INNER JOIN copia co
            ON no.id_copia = co.id_copia
            INNER JOIN film fi
            ON co.id_film = fi.id_film
            INNER JOIN price_details pd
            ON no.id_noleggio = pd.id_noleggio
            WHERE co.id_punto_vendita = %d
            AND no.id_cliente %s";
        $query = sprintf($query, $filters->id_punto_vendita, 
                                $filters->id_cliente ? 
                                    sprintf("= %d", $filters->id_cliente) :
                                    sprintf("> 0") );
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $copiesArray = array();
        while($row = $res->fetch_assoc()){
            $copiesArray[] = $row;
        }
        exit(json_encode($copiesArray));
    }

    function GetArchivedVideoForUser() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $filters = json_decode($_POST["filters"]);
        $query = 
            "SELECT co.id_copia, no.id_storico_noleggio, no.data_inizio, no.data_fine, no.prezzo_totale, no.data_effettiva_restituzione,
                fi.titolo, cli.nome, cli.cognome, cli.id_cliente
            FROM storico_noleggio no
            INNER JOIN cliente cli
            ON no.id_cliente = cli.id_cliente
            INNER JOIN copia co
            ON no.id_copia = co.id_copia
            INNER JOIN film fi
            ON co.id_film = fi.id_film
            WHERE co.id_punto_vendita = %d
            AND no.id_cliente %s";
        $query = sprintf($query, $filters->id_punto_vendita, 
                                $filters->id_cliente ? 
                                    sprintf("= %d", $filters->id_cliente) :
                                    sprintf("> 0") );
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $copiesArray = array();
        while($row = $res->fetch_assoc()){
            $copiesArray[] = $row;
        }
        exit(json_encode($copiesArray));
    }

    function ReturnCopies() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $copies = json_decode($_POST["copies"]);
        Logger::Write("COPIES ".json_encode($copies), $GLOBALS["CorrelationID"]);
        if(!$copies) {
            throw new Exception("Copies array is empty or null");
        }
        try {
            $this->dbContext->StartTransaction();
            for($i = 0; $i < count($copies); $i++) {               
                $details = self::GetRentDetails($copies[$i]->id_noleggio);
                $archivedRentId = self::ArchiveRent($details, $copies[$i]->prezzo_extra);
                self::DeleteActiveRent($copies[$i]->id_noleggio);
                self::ResetRentFlagInCopiesTable($copies[$i]->id_copia);
            }
            $this->dbContext->CommitTransaction();
        } catch(Throwable $ex) {
            Logger::Write("Error while processing ". __FUNCTION__ ." request: $ex", $GLOBALS["CorrelationID"]);
            $this->dbContext->RollBack();
            http_response_code(500);
        }
        exit(json_encode(new RestApiResponse(true, sprintf("Id in storico noleggio: %d", $archivedRentId))));
    }

    private function GetRentDetails($id_noleggio) {
        $query = 
            "SELECT * FROM noleggio WHERE id_noleggio = %d LIMIT 1";
        $query = sprintf($query, $id_noleggio);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $row = $res->fetch_assoc();
        if(!$row) {
            throw new Exception(sprintf("Couldn't find the rent with id: %d", $id_noleggio));
        }
        return $row;
    }

    private function ArchiveRent($row, $prezzo_extra) {
        $today = date("Y-m-d", time());
        $query = 
            "INSERT INTO storico_noleggio
            (id_dipendente,
            id_punto_vendita,
            id_cliente,
            id_copia,
            id_tariffa,
            data_inizio,
            data_fine,
            data_effettiva_restituzione,
            prezzo_totale,
            prezzo_extra)
            VALUES
            (%d, %d, %d, %d, %d, '%s', '%s', '%s', %f, %f)";
        $query = sprintf($query, $row["id_dipendente"], $row["id_punto_vendita"], $row["id_cliente"], $row["id_copia"], 
                            $row["id_tariffa"], $row["data_inizio"], $row["data_fine"], $today, $row["prezzo_totale"], 
                            ($prezzo_extra != null ? $prezzo_extra : 0));
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);                                     
        if(!$res) {
            throw new Exception("Insert failed");
        }
        Logger::Write("Rent successfully archived, Id: ".$noleggio_id, $GLOBALS["CorrelationID"]);
        return $this->dbContext->GetLastID();
    }

    private function DeleteActiveRent($id_noleggio) {
        $query = 
            "DELETE FROM noleggio WHERE id_noleggio = %d";
        $query = sprintf($query, $id_noleggio);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        if(!$res) {
            throw new Exception(sprintf("Couldn't delete item in table noleggio with id: %d", $id_noleggio));
        }
    }

    private function ResetRentFlagInCopiesTable($id_copia) {
        $query = 
            "UPDATE copia 
            SET noleggiato = 0, data_prenotazione_noleggio = NULL, id_dipendente_prenotazione_noleggio = NULL
            WHERE id_copia = %d";
        $query = sprintf($query, $id_copia);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        if(!$res) {
            throw new Exception(sprintf("Couldn't update item in table copia with id: %d", $id_noleggio));
        }
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        try {
            $this->dbContext = new DBConnection();
            switch($_POST["action"]) {
                case "getRentedVideoForUser":
                    self::GetRentedVideoForUser();
                    break;
                case "getArchivedVideoForUser":
                    self::GetArchivedVideoForUser();
                    break;
                case "returnCopies":
                    self::ReturnCopies();
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

class RestApiResponse {
    public $status;
    public $message;
    function __construct($status, $message) {
        $this->status = $status;
        $this->message = $message;
    }
}
?>