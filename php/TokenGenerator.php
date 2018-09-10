<?php

// Classe che genera e legge il token per il JWT
class TokenGenerator {
    private static $Initialized = false;

    /* Configurazioni per i token, da spostare */
    private static $EncryptMethod = "AES-256-CBC";
    private static $SecretKey = "VideonoleggioKey";
    private static $SecretIv = "VideonoleggioivKey";
    private static $Key;
    private static $Iv;

    // Metodo di inizializzazione della classe Logger, per consentire la staticità della stessa
    private static function initialize() {
        if(self::$Initialized) {
            return;
        }
        self::$Key = hash("sha256", self::$SecretKey);
        self::$Iv = substr(hash("sha256", self::$SecretIv), 0, 16);
        self::$Initialized = true;
    }

    /* Cripta il token da restituire al client */
    public static function EncryptToken(string $data) {
        self::initialize();
        $output = openssl_encrypt($data, self::$EncryptMethod, self::$Key, false, self::$Iv);
        if($output != null) {
            Logger::Write("Token generated succesfully. $output", $GLOBALS["CorrelationID"]);
        } 
        return $output;
    }

    /* Decripta il token da restituire al client */
    public static function DecryptToken(string $data) {
        self::initialize();
        // Logger::Write("Decrypting token. $data", $GLOBALS["CorrelationID"]); Add Levels
        $output = openssl_decrypt($data, self::$EncryptMethod, self::$Key, false, self::$Iv);
        return $output;
    }

    /* Verifica la validità del token fornito nell'header Authorization della request */
    public static function ValidateToken() {
        $authHeader = isset($_SERVER["HTTP_AUTHORIZATION"]) ? $_SERVER["HTTP_AUTHORIZATION"] : null;
        if($authHeader === null) {
            Logger::Write("Request is missing the Authorization header.", $GLOBALS["CorrelationID"]);
            http_response_code(401);
            exit("Header di autorizzazione non trovato.");
        }
        $token = substr($authHeader, 7, strlen($authHeader));
        $decryptedToken = self::DecryptToken($token);
        if(strlen($token) == 0 || $decryptedToken == null) {
            Logger::Write("Authentication token missing or invalid.", $GLOBALS["CorrelationID"]);
            http_response_code(401);
            exit("Header di autorizzazione non valido, effettuare l'accesso al gestionale.");
        }
        Logger::Write("Token validated.", $GLOBALS["CorrelationID"]);
    }
}
?>