<?php
include 'DBConnection.php';
include 'TokenGenerator.php';
include 'Constants.php';

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);
$correlationId = $GLOBALS["CorrelationID"];
$development = true;

class BookingManagementService {
    function __construct() { }

    /** Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection */
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    ////////////////////////////////////// RECUPERARE IL COUNT DELLE PRENOTAZIONI E RAGGRUPPARE PER FILM.
    function GetComingSoonMovies() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $id_punto_vendita = json_decode($_POST["id_punto_vendita"]);
        $maxDateToShowBookings = self::GetDateForBookingFilter();
        $query = 
            "SELECT fi.id_film, fi.titolo, fi.durata, fi.prezzo_giornaliero, fi.data_uscita,
                    ge.tipo, cp.nome as casa_produttrice_nome, re.nome as regista_nome, re.cognome as regista_cognome,
                    COUNT(prenotazioni.id_prenotazione) as numero_prenotazioni
            FROM film fi        
            INNER JOIN genere ge
            ON fi.id_genere = ge.id_genere
            INNER JOIN casa_produttrice cp
            ON fi.id_casa_produttrice = cp.id_casa_produttrice
            INNER JOIN regista re
            ON fi.id_regista = re.id_regista
            LEFT JOIN (SELECT id_prenotazione, id_film 
                        FROM prenotazione 
                        WHERE id_punto_vendita = %d) as prenotazioni
            ON fi.id_film = prenotazioni.id_film           
            WHERE fi.inUscita = 1
            OR fi.data_uscita > '%s'
            GROUP BY fi.id_film";
        $query = sprintf($query, $id_punto_vendita, $maxDateToShowBookings);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $moviesArray = array();
        while($row = $res->fetch_assoc()){
            $moviesArray[] = $row;
        }
        if(count($moviesArray) < 1) {
            return [];
        }
        usort($moviesArray, "SortByFilmId");        
        $query = 
            "SELECT ca.id_film, at.nome as attore_nome, at.cognome as attore_cognome                    
            FROM cast ca
            INNER JOIN attore at
            ON ca.id_attore = at.id_attore
            WHERE ca.id_film         
            IN (%s)";
        $idsString = "";
        for($i = 0; $i < count($moviesArray); $i++) {            
            $idsString .= sprintf("%d, ", $moviesArray[$i]["id_film"]);
        }
        $idsString = rtrim($idsString);
        $idsString = rtrim($idsString, ",");
        $query = sprintf($query, $idsString);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $actorsArrays = array();
        while($row = $res->fetch_assoc()){
            for($i = 0; $i < count($moviesArray); $i++) {              
                if($moviesArray[$i]["id_film"] == $row["id_film"]) {    
                    $actor = new Actor($row);                                
                    $moviesArray[$i]["cast"][] = $actor;
                    break;
                }            
            }
        }
        return $moviesArray;
    }

    /** Restituisce la data odierna meno il numero di giorni stabilito perché vengano visualizzati i video nella tabella delle prenotazioni */
    private function GetDateForBookingFilter() {
        $today = time();
        $allowedDaysAfterRelease = 7; 
        $maxAllowedDateAfterRelease = ($today / (60 * 60 * 24)) - $allowedDaysAfterRelease; // Recuperare il numero dei giorni dalla tabella impostazione
        $maxAllowedDateAfterRelease = $maxAllowedDateAfterRelease * (60 * 60 * 24);
        return date("Y-m-d", $maxAllowedDateAfterRelease);
    }

    /** Restituisce -1 se l'utente non è stato trovato. Un array di prenotazioni se l'utente ha già prenotazioni con un film. Una row con i dettagli dell'utente se l'utente esiste e può prenotare */
    function GetCustomerBookingsAndId() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");        
        $filters = json_decode($_POST["filters"]);
        $user = self::FindCustomerById($filters->id_cliente);
        if(!$user) {
            return -1;
        }        
        $bookings = self::GetBookingsForUser($filters->id_cliente, $filters->id_punto_vendita, $filters->array_id_film);
        if(count($bookings) > 0) {
            return $bookings;
        }
        return $user;        
    }

    
    private function FindCustomerById($id_cliente) {
        $query = 
            "SELECT cl.id_cliente, cl.nome, cl.cognome, cl.indirizzo, fi.nome_fidelizzazione, fi.percentuale
            FROM cliente cl
            INNER JOIN fidelizzazione fi
            ON cl.id_fidelizzazione = fi.id_fidelizzazione
            WHERE id_cliente = %d
            LIMIT 1";
        $query = sprintf($query, $id_cliente);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $row = $res->fetch_assoc();
        return $row;
    }

    private function GetBookingsForUser($id_cliente, $id_punto_vendita, $moviesArray) {
        $query = 
            "SELECT id_film
            FROM prenotazione pr        
            WHERE pr.id_cliente = %d
            AND pr.id_punto_vendita = %d
            AND pr.id_film IN (%s)";
        $idsString = "";
        for($i = 0; $i < count($moviesArray); $i++) {            
            $idsString .= sprintf("%d, ", $moviesArray[$i]);
        }
        $idsString = rtrim($idsString);
        $idsString = rtrim($idsString, ",");
        $query = sprintf($query, $id_cliente, $id_punto_vendita, $idsString);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $bookingsArray = array();
        while($row = $res->fetch_assoc()) {
            $bookingsArray[] = $row;
        }
        return $bookingsArray;
    }

    function GetUsersForBooking() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice"); 
        $booking = json_decode($_POST["booking"]);       
        $query = 
            "SELECT pr.id_prenotazione, cl.id_cliente, cl.nome, cl.cognome, fi.titolo
            FROM prenotazione pr
            INNER JOIN film fi
            ON pr.id_film = fi.id_film
            INNER JOIN cliente cl
            ON pr.id_cliente = cl.id_cliente
            WHERE pr.id_film = %d
            AND pr.id_punto_vendita = %d";
        $idsString = "";
        $query = sprintf($query, $booking->id_film, $booking->id_punto_vendita);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()) {
            $array[] = $row;
        }
        return $array;   
    }

    function BookMovies() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");        
        $bookings = json_decode($_POST["bookings"]);
        try {
            $this->dbContext->StartTransaction();
            for($i = 0; $i < count($bookings); $i++) {
                $booking = $bookings[$i];
                $query = 
                    "INSERT INTO prenotazione
                    (id_cliente,
                    id_dipendente,
                    id_punto_vendita,
                    id_film,
                    id_stato_prenotazione)
                    VALUES
                    (%d, %d, %d, %d, NULL);";
                $query = sprintf($query, $booking->id_cliente, $booking->id_dipendente, $booking->id_punto_vendita,
                                    $booking->id_film);
                Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
                $res = self::ExecuteQuery($query);
            }
            $this->dbContext->CommitTransaction();
        } catch (Throwable $ex) {
            Logger::Write("Error while processing ". __FUNCTION__ ." request: $ex", $GLOBALS["CorrelationID"]);
            $this->dbContext->RollBack();
            http_response_code(500);
        }
        return $res;        
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        try {
            $this->dbContext = new DBConnection();
            switch($_POST["action"]) {
                case "getComingSoonMovies":
                    $res = self::GetComingSoonMovies();
                    break;
                case "getCustomerBookingsAndId":
                    $res = self::GetCustomerBookingsAndId();
                    break;
                case "getUsersForBooking":
                    $res = self::GetUsersForBooking();
                    break;
                case "bookMovies":
                    $res = self::BookMovies();
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
        Logger::Write("Opreation ". $_POST["action"] ." was successful.", $GLOBALS["CorrelationID"]);
        exit(json_encode($res));
    }
}

// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
try {
    Logger::Write("Reached BookingManagementService API", $GLOBALS["CorrelationID"]);    
    $Auth = new BookingManagementService();
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