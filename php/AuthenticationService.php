<?php
include 'DBConnection.php';
include 'TokenGenerator.php';
use TokenGenerator;
use Logger;

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);
$correlationId = $GLOBALS["CorrelationID"];

class AuthenticationService {
    private static $authCookieName = "RentNetAuth";
    private $dbContext;

    function __construct() { }

    /** Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection */
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    /** Effettua il login al sito con l'username inserito */
    public function Login() {             
        try {
            Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
            $credentials = json_decode($_POST["credentials"]);
            $query = 
                "SELECT dip.id_dipendente, dip.username, dip.password, del.codice, del.nome as delega_nome,
                    pv.nome as punto_vendita_nome, pv.indirizzo as punto_vendita_indirizzo, c.nome as citta_nome,
                    dip.id_punto_vendita as punto_vendita_id_punto_vendita
                FROM dipendente as dip
                INNER JOIN delega as del
                ON dip.id_delega = del.id_delega
                INNER JOIN punto_vendita as pv
                ON dip.id_punto_vendita = pv.id_punto_vendita
                INNER JOIN citta as c
                ON pv.id_citta = c.id_citta
                WHERE username = '%s'
                LIMIT 1";
            $query = sprintf($query, addslashes($credentials->username));
            $res = self::ExecuteQuery($query);
            $row = $res->fetch_assoc();
            $fetchedPassword = $row["password"];

            if(password_verify($credentials->password, $fetchedPassword)) {                     
                $loginContext = new LoginContext($row);
                Logger::Write(sprintf("User %s validated, starting token generation.", $loginContext->username), $GLOBALS["CorrelationID"]);       
                self::SetAuthenticationCookie($loginContext);
                exit(json_encode($loginContext));
                Logger::Write("User $this->username succesfully logged in.", $GLOBALS["CorrelationID"]);
            }
            else{
                http_response_code(401);                
            }
        } 
        catch (Throwable $ex) {
            Logger::Write("Error occured in " . __FUNCTION__. " -> $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500); 
        }
    }

    private function SetAuthenticationCookie($cookieValue) {
        $cookie = TokenGenerator::GenerateTokenForUser($cookieValue);
        $cookieDuration = time() + (3600 * 12); // Scade in 12 ore
        setcookie(self::$authCookieName, $cookie, $cookieDuration, "/", "", false, true);
        Logger::Write("Authentication cookie has been set: ".$_COOKIE[self::$authCookieName], $GLOBALS["CorrelationID"]);
    }

    public function Logout() {
        $user = json_decode(TokenGenerator::ValidateToken());
        Logger::Write(sprintf("%s", json_encode($user)), $GLOBALS["CorrelationID"]);
        Logger::Write(sprintf("User %s logging out.", $user->username), $GLOBALS["CorrelationID"]);
        setcookie(self::$authCookieName, "", time() - 1, "/", "", false, true);
    }

    public function AuthenticateUser() {             
        try {            
            exit(TokenGenerator::ValidateToken());
        } 
        catch (Throwable $ex) {
            Logger::Write("Error occured in " . __FUNCTION__. " -> $ex", $GLOBALS["CorrelationID"]);
        }
    }

    // Switcha l'operazione richiesta lato client
    function Init(){
        switch($_POST["action"]) {
            case "login":
                self::Login();
                break;
            case "logout":
                self::Logout();
                break;
            case "authenticateUser":
                self::AuthenticateUser();
                break;
            default: 
                exit(json_encode($_POST));
                break;
        }
    }
}

// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
try {
    Logger::Write("Reached AuthenticationService API", $GLOBALS["CorrelationID"]);    
    $Auth = new AuthenticationService();
    $Auth->Init();
}
catch(Throwable $ex) {
    Logger::Write("Error occured: $ex", $GLOBALS["CorrelationID"]);
    http_response_code(500);
    exit(json_encode($ex->getMessage()));
}

class AuthenticationCookie {
    public $username;
    public $id_dipendente;
    public $delega_codice;

    public function __construct($row) {
        $this->username = $row["username"];
        $this->id_dipendente = $row["id_dipendente"];
        $this->delega_codice = $row["codice"];
    }
}

class LoginContext {
    public $username;
    public $id_dipendente;
    public $delega_codice;
    public $delega_nome;
    public $punto_vendita_nome;
    public $citta_nome;
    public $punto_vendita_indirizzo;
    public $punto_vendita_id_punto_vendita;

    public function __construct($row) {
        $this->username = $row["username"];
        $this->id_dipendente = $row["id_dipendente"];
        $this->delega_codice = $row["codice"];
        $this->delega_nome = $row["delega_nome"];
        $this->punto_vendita_nome = $row["punto_vendita_nome"];
        $this->punto_vendita_indirizzo = $row["punto_vendita_indirizzo"];
        $this->punto_vendita_id_punto_vendita = $row["punto_vendita_id_punto_vendita"];
        $this->citta_nome = $row["citta_nome"];
    }
}
?>