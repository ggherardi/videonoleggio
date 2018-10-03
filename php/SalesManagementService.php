<?php
include 'DBConnection.php';
include 'TokenGenerator.php';
include 'Constants.php';

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);
$correlationId = $GLOBALS["CorrelationID"];
$development = true;

class SalesManagementService {
    function __construct() { }

    /** Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection */
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    function GetStoresAndSales() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::RESPONSABILE, "delega_codice");
        $filters = json_decode($_POST["filters"]);
        $query = 
            "SELECT pv.id_punto_vendita, pv.nome, pv.indirizzo, ci.nome as citta_nome, noleggi.incasso_giornaliero
            FROM punto_vendita pv
            INNER JOIN citta ci
            ON pv.id_citta = ci.id_citta 
            LEFT JOIN (SELECT SUM(no.prezzo_totale) as incasso_giornaliero, no.id_noleggio, no.id_punto_vendita 
                        FROM noleggio no 
                        WHERE no.data_inizio >= '%s' 
                        AND no.data_inizio <= '%s') as noleggi
            ON noleggi.id_punto_vendita = pv.id_punto_vendita            
            %s
            GROUP BY pv.id_punto_vendita;"; 
        $whereCondition = sprintf("WHERE pv.id_punto_vendita = %d", $filters->id_punto_vendita);
        $query = sprintf($query, $filters->data_inizio, sprintf("%s 23:59", $filters->data_fine), ($filters->id_punto_vendita > 0 ? $whereCondition : ""));          
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            $array[] = $row;
        }
        return count($array) > 0 ? $array : [];
    }

    
    function GetSalesForEmployees() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::RESPONSABILE, "delega_codice");
        $filters = json_decode($_POST["filters"]);
        $query = 
            "SELECT id_dipendente, nome, cognome
            FROM dipendente
            WHERE id_punto_vendita = %1\$d;
            
            SELECT SUM(no.prezzo_totale) as incasso_totale, no.id_dipendente
            FROM noleggio no
            WHERE no.id_punto_vendita = %1\$d
            AND no.data_inizio >= '%2\$s'
            AND no.data_inizio <= '%3\$s'
            GROUP BY no.id_dipendente;
            
            SELECT SUM(no.prezzo_totale) as incasso_totale, no.id_dipendente
            FROM storico_noleggio no
            WHERE no.id_punto_vendita = %1\$d
            AND no.data_inizio >= '%2\$s'
            AND no.data_inizio <= '%3\$s'
            GROUP BY no.id_dipendente;";                     
        $query = sprintf($query, $filters->id_punto_vendita, $filters->data_inizio, sprintf("%s 23:59", $filters->data_fine));          
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $this->dbContext->ExecuteMultiQuery($query);
        $array = array();
        $mysqli = $this->dbContext->GetPublicConnection();
        $i = 0;
        do {
            Logger::Write("LOOP N. ".$i++, $GLOBALS["CorrelationID"]);
            $res = $mysqli->store_result();
            $array[] = $res->fetch_all(MYSQLI_ASSOC);
            if(!$mysqli->more_results()) {
                break;
            }            
        } while($mysqli->next_result());

        return count($array) > 0 ? $array : [];
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        try {
            $this->dbContext = new DBConnection();
            switch($_POST["action"]) {
                case "getStoresAndSales":
                    $res = self::GetStoresAndSales();
                    break;
                case "getSalesForEmployees":
                    $res = self::GetSalesForEmployees();
                    break;
                default: 
                    exit(json_encode($_POST));
                    break;
            }
        }
        catch(Throwable $ex) {
            Logger::Write("Error occured -> $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit();
        }
        Logger::Write("Opreation ". $_POST["action"] ." was successful.", $GLOBALS["CorrelationID"]);
        exit(json_encode($res));
    }
}

// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
try {
    Logger::Write("Reached SalesManagementService API", $GLOBALS["CorrelationID"]);    
    $Auth = new SalesManagementService();
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