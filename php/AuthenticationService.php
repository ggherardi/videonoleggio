<?php
include 'PHPConst.php';
include 'DBConnection.php';
include 'models\Models.php';
include 'TokenGenerator.php';
use TokenGenerator;
use Logger;
use Models;

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);
$correlationId = $GLOBALS["CorrelationID"];

class AuthenticationService {
    private $name;
    private $surname;
    private $username;
    private $email;
    private $password;
    private $dbContext;

    function __construct() {
        self::RetrievePostVariables();
    }

    /** Recupera le variabili POST passate dalla chiamata lato client */
    private function RetrievePostVariables() {
        $this->name = isset($_POST["name"]) ? $_POST["name"] : "";
        $this->surname = isset($_POST["surname"]) ? $_POST["surname"] : "";
        $this->username = isset($_POST["username"]) ? $_POST["username"] : "";
        $this->email = isset($_POST["email"]) ? $_POST["email"] : "";
        $this->password = isset($_POST["password"]) ? $_POST["password"] : "";
    }

    /** Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection */
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    private function Test(){
        exit(json_encode("test successful"));
    }

    /** Effettua il login al sito con l'username inserito, ritorna:
    * -1 se non è stato trovato l'account associato
    * L'oggetto $user (UserModel) se l'account è stato trovato */
    private function Login(){             
        try {
            Logger::Write("Processing Login request.", $GLOBALS["CorrelationID"]);
            $query = "SELECT *
                FROM user 
                WHERE Username = '$this->username'";

            $res = self::ExecuteQuery($query);

            while($row = $res->fetch_assoc()){
                $fetchedPassword = $row["Password"];
                $validRow = $row;
            }
            if(password_verify($this->password, $fetchedPassword)){
                $user = new Models\UserModel($validRow["Username"], $validRow["Id"], $validRow["Nome"]);
                Logger::Write("User $this->username validated, generating Token.", $GLOBALS["CorrelationID"]);
                $token = TokenGenerator::EncryptToken(json_encode($user));
                $user->Token = $token;
                echo json_encode($user);
                Logger::Write("User $this->username succesfully logged in.", $GLOBALS["CorrelationID"]);
            }
            else{
                echo json_encode(-1);
            }
        } 
        catch (Throwable $ex) {
            Logger::Write("Error during the login of user $this->username -> $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($exMessage));
        }
    }

    /** Effettua l'iscrizione al sito, ritorna responseCode:
    * -1 se l'email e lo username esistono già nel DB
    * -2 se l'username esiste già nel DB
    * -3 se l'email esiste già nel DB
    * -4 per errori incontrati durante l'inserimento
    * se l'iscrizione è andata a buon fine */
    private function SignUp(){  
        Logger::Write("Signup process started.", $GLOBALS["CorrelationID"]);    
        $responseCode = self::CheckIfUserAlreadyExists();

        if($responseCode != 0) {
            echo json_encode($responseCode);
            return;
        }

        $successInsert = self::InsertNewUser();
        if(!$successInsert){
            $responseCode = -4;
        }

        echo json_encode($responseCode);
    }

    /** Controlla se lo username o l'email sono già presenti nel DB */
    private function CheckIfUserAlreadyExists() {
        $errorCode = 0;

        $query = 
            "SELECT *
            FROM user
            WHERE Username = '$this->username'
            OR Email = '$this->email'";

        $res = self::ExecuteQuery($query);

        while($row = $res->fetch_assoc()){
            if($row["Username"] == $this->username && $row["Email"] == $this->email) {
                $errorCode = -1;
            }
            else if($row["Username"] == $this->username) {
                $errorCode = -2;
            }
            else {
                $errorCode = -3;
            }
        }
        return $errorCode;
    }

    /** Registra il nuovo utente creando una row nella table user e una nella table user_detail */
    private function InsertNewUser() {
        Logger::Write("Registering new user: $this->name $this->surname with email: $this->email", $GLOBALS["CorrelationID"]);  
        $res = false;
        $this->dbContext->StartTransaction();
        try {
            $encodedPassword = password_hash($this->password, PASSWORD_DEFAULT);
            $query = 
                "INSERT INTO user
                VALUES (DEFAULT, '$this->username', '$this->email', '$encodedPassword', '$this->name', '$this->surname')";
            $res = self::ExecuteQuery($query);
            if(!$res) {
                throw new Exception("Error while inserting new user");
            }
            $userId = $this->dbContext->GetLastID();
            $query = 
                "INSERT INTO user_detail
                VALUES (DEFAULT, $userId, DEFAULT, DEFAULT, DEFAULT)";
            $res = self::ExecuteQuery($query);
            Logger::Write("$query", $GLOBALS["CorrelationID"]);
            if(!$res) {
                throw new Exception("Error while inserting new user details");
            } 
            $query = 
                "INSERT INTO car_detail
                VALUES (DEFAULT, $userId, DEFAULT, DEFAULT)";
            $res = self::ExecuteQuery($query);
            Logger::Write("$query", $GLOBALS["CorrelationID"]);
            if(!$res) {
                throw new Exception("Error while inserting new user details");
            } 
            $transactionRes = $this->dbContext->CommitTransaction();
        }
        catch(Throwable $ex) {
            $this->dbContext->RollBack();
            Logger::Write("Error occured in InsertNewUser -> $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            $res = $false;
        }
        return $res;
    }

    // Switcha l'operazione richiesta lato client
    function Init(){
        
        exit(json_encode("test"));
        switch($_POST["action"]){
            case "signup":
                self::SignUp();
            break;
            case "login":
                self::Login();
                break;
            default: 
                echo json_encode($_POST);
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
?>