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

    function ReturnCopies() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $copies = json_decode($_POST["copies"]);
        Logger::Write("COPIES ".$copies, $GLOBALS["CorrelationID"]);
        try {
            $this->dbContext->StartTransaction();
            for($i = 0; $i < count($copies); $i++) {               
                $details = self::GetRentDetails($copies->id_noleggio);
                self::ArchiveRent($details);
                // $amount = self::CalculateRentAmount($details, $videos[$i]);
                // self::AddRentAmountToTable($noleggio_id, $amount);
            }
            $this->dbContext->CommitTransaction();
        } catch(Throwable $ex) {
            Logger::Write("Error while processing ". __FUNCTION__ ." request: $ex", $GLOBALS["CorrelationID"]);
            $this->dbContext->RollBack();
            http_response_code(500);
        }
        exit(json_encode(true));
    }

    private function GetRentDetails($id_noleggio) {
        $query = 
            "SELECT * FROM noleggio WHERE id_noleggio = %d LIMIT 1";
        $query = sprintf($query, $filters->id_noleggio);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $row = $res->fetch_assoc();
        return $row;
    }

    private function ArchiveRent($row, $prezzo_extra) {
        $query = 
            "INSERT INTO storico_noleggio
            (id_dipendente,
            id_punto_vendita,
            id_cliente,
            id_copia,
            id_tariffa,
            data_inizio,
            data_fine,
            prezzo_totale,
            prezzo_extra)
            VALUES
            (%d, %d, %d, %d, %d, '%s', '%s', %f, %f)";
        $query = sprintf($query, $row["id_dipendente"], $row["id_punto_vendita"], $row["id_cliente"], $row["id_copia"], 
                            $row["id_tariffa"], $row["data_inizio"], $row["data_fine"], $row["prezzo_totale"], 
                            $prezzo_extra != null ? $prezzo : 0);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);                                     
        if(!$res) {
            throw("Insert failed");
        }
        Logger::Write("Rent successfully archived, Id: ".$noleggio_id, $GLOBALS["CorrelationID"]);
        return $this->dbContext->GetLastID();
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        try {
            $this->dbContext = new DBConnection();
            switch($_POST["action"]) {
                case "getRentedVideoForUser":
                    self::GetRentedVideoForUser();
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
?>