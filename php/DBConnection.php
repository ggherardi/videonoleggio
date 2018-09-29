<?php
include 'Logger.php';
use Logger;

class DBConnection {
    private $Connection;

    public $ServerName;
    public $UserName;
    public $Password;
    public $DB;

    //PROD
    //function __construct($servername = "127.0.0.1", $username = "newuser", $password = "password", $db = "videonoleggio") {
    //DEV
    function __construct($servername = "127.0.0.1", $username = "root", $password = "root", $db = "videonoleggio") {
        $this->ServerName = $servername;
        $this->UserName = $username;
        $this->Password = $password;
        $this->DB = $db;
        $this->EstablishConnection();
    }

    private function getConnection(): mysqli {
        return $this->Connection;
    }

    private function EstablishConnection() {
        try {
            Logger::Write("Establishing connection to DB", $GLOBALS["CorrelationID"]);
            // $this->Connection = mysqli_connect($this->ServerName, $this->UserName, $this->Password, $this->DB);
            $this->Connection = new mysqli($this->ServerName, $this->UserName, $this->Password, $this->DB);
            if($this->Connection->connect_errno){
                Logger::Write(("Error while establishing a connection with the DB -> " . ($this->Connection->connect_error)), $GLOBALS["CorrelationID"]);
                throw new Exception("ERROR! ".$this->Connection->mysqli_error);
            }
        }
        catch (Throwable $ex) {
            $exMessage = $ex->getMessage();
            Logger::Write("Error while establishing a connection with the DB -> $exMessage", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($exMessage));
        }
    }

    function StartTransaction() {
        Logger::Write("Starting transaction", $GLOBALS["CorrelationID"]);
        $this->getConnection()->begin_transaction();
    }

    function RollBack() {
        Logger::Write("Rolling back current transaction", $GLOBALS["CorrelationID"]);
        $this->getConnection()->rollback();
    }

    function CommitTransaction() {
        Logger::Write("Committing transaction", $GLOBALS["CorrelationID"]);
        $this->getConnection()->commit();
    }

    /** Ritorna il risultato della query. Se non sono stati trovati, la chiamata riesce e ritorna un array vuoto */
    function ExecuteQuery($query = "") {
        try {
            Logger::Write("Executing query", $GLOBALS["CorrelationID"]);
            // Logger::Write($query, $GLOBALS["CorrelationID"]);
            $msRes = $this->getConnection()->query($query);
            if(!$msRes) {     
                if($this->Connection->error){
                    throw new Exception($this->Connection->error);   
                }
                Logger::Write("No results found", $GLOBALS["CorrelationID"]);                
            }
            Logger::Write("Query executed successfully", $GLOBALS["CorrelationID"]);
            return $msRes;
        } 
        catch (Throwable $ex) {
            $exMessage = $ex->getMessage();
            Logger::Write("Error while executing query -> $exMessage", $GLOBALS["CorrelationID"]);
            throw new Exception($ex);
        }
    }

    function GetLastID() {
        return $this->Connection->insert_id;
    }
}
?>