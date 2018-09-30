<?php
include 'DBConnection.php';
include 'TokenGenerator.php';
include 'Constants.php';

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);
$correlationId = $GLOBALS["CorrelationID"];
$development = true;

class CustomerManagementService {

    function __construct() { }

    /** Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection */
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    function GetAllCustomersWithPremiumCode() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $query = 
            "SELECT *
            FROM cliente
            INNER JOIN fidelizzazione
            on cliente.id_fidelizzazione = fidelizzazione.id_fidelizzazione";
        $res = self::ExecuteQuery($query);
        $array = array();
        while($row = $res->fetch_assoc()){
            if(strlen($row["liberatoria"]) > 0) {
                $blob = $row["liberatoria"];
                $encoded64Blob = base64_encode("$blob");
                $row["liberatoria"] = $encoded64Blob;
            }
            $array[] = $row;
        }
        header("Content-Type: application/pdf");
        return $array;
    }

    function InsertNewCustomer() {
        ob_start();
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $customer = json_decode($_POST["customer"]);
        if(count($_FILES) > 0) {
            $fileData = self::GetFileData();
        }
        $query = 
            "INSERT INTO cliente
            (liberatoria, id_fidelizzazione, nome, cognome, indirizzo, telefono_casa, telefono_cellulare, email, data_nascita)
            VALUES
            (%s, %d, '%s', '%s', '%s', '%s', '%s', '%s', '%s')";
        $query = sprintf($query, ($fileData != null ? "'$fileData'" : "DEFAULT"), // Ho aggiunto gli apici a $fileData qui, altrimenti non prende il DEFAULT
            $customer->id_fidelizzazione, 
            $customer->nome, 
            $customer->cognome, 
            $customer->indirizzo, 
            $customer->telefono_casa,
            $customer->telefono_cellulare, 
            $customer->email,
            $customer->data_nascita);
        $res = self::ExecuteQuery($query);
        ob_clean();
        if($res) {
            return $res;
        } else {
            http_response_code(500);
        }
    }

    private function GetFileData() {
        $filename = $_FILES['file']['tmp_name'];
        $file = readfile($_FILES['file']['tmp_name']);
        $filePointer = fopen($_FILES['file']['tmp_name'], 'rb');
        $fileData = fread($filePointer, filesize($_FILES['file']['tmp_name']));
        $fileData = addslashes($fileData);
        return $fileData;
    }

    function DeleteCustomer() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $id_cliente = $_POST["id_cliente"]; 
        $query = 
            "DELETE FROM cliente              
            WHERE id_cliente = %d";
        $query = sprintf($query, $id_cliente);
        Logger::Write("Query: ".$query, $GLOBALS["CorrelationID"]);
        $res = self::ExecuteQuery($query);
        if($res) {
            return $res;
        } else {
            http_response_code(500);
        }       
    }

    function EditCustomer() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $customer = json_decode($_POST["customer"]);
        $keepFile = $customer->keepExistingFile;
        if(count($_FILES) > 0) {
            $fileData = self::GetFileData();
        }
        $query = 
            "UPDATE `videonoleggio`.`cliente`
            SET
            id_fidelizzazione = %d,
            nome = '%s',
            cognome = '%s',
            indirizzo = '%s',
            telefono_casa = '%s',
            telefono_cellulare = '%s',
            email = '%s',
            data_nascita = '%s'".
            (!$keepFile ? ", liberatoria = " : "")
            ."%s
            WHERE id_cliente = %d";
        $query = sprintf($query,             
                $customer->id_fidelizzazione, 
                $customer->nome, 
                $customer->cognome, 
                $customer->indirizzo, 
                $customer->telefono_casa,
                $customer->telefono_cellulare, 
                $customer->email,
                $customer->data_nascita,
                (!$keepFile ? ($fileData != null ? "'$fileData'" : "DEFAULT") : ""), // Ho aggiunto gli apici a $fileData qui, altrimenti non prende il DEFAULT
                $customer->id_cliente);
        $res = self::ExecuteQuery($query);
        if($res) {
            return $res;
        } else {
            http_response_code(500);
        }    
    }

    function FindCustomerById() {
        Logger::Write("Processing ". __FUNCTION__ ." request.", $GLOBALS["CorrelationID"]);
        TokenGenerator::CheckPermissions(PermissionsConstants::ADDETTO, "delega_codice");
        $id_cliente = $_POST["id_cliente"];
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

    // Switcha l'operazione richiesta lato client
    function Init() {
        try {
            switch($_POST["action"]) {
                case "getAllCustomersWithPremiumCode":
                    $res = self::GetAllCustomersWithPremiumCode();
                    break;
                case "insertNewCustomer":
                    $res = self::InsertNewCustomer();
                    break;
                case "deleteCustomer":
                    $res = self::DeleteCustomer();
                    break;
                case "editCustomer":
                    $res = self::EditCustomer();
                    break;
                case "findCustomerById":
                    $res = self::FindCustomerById();
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
    Logger::Write("Reached CustomerManagementService API", $GLOBALS["CorrelationID"]);    
    $Auth = new CustomerManagementService();
    $Auth->Init();
}
catch(Throwable $ex) {
    Logger::Write("Error occured: $ex", $GLOBALS["CorrelationID"]);
    http_response_code(500);
    exit(json_encode($ex->getMessage()));
}
?>