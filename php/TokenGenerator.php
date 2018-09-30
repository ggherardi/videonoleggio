<?php
// Classe che genera e legge il token per il JWT
class TokenGenerator {
    private static $Initialized = false;

    /* Configurazioni per i token, da spostare */
    private static $authCookieName = "RentNetAuth";
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
            Logger::Write("Token generated succesfully.", $GLOBALS["CorrelationID"]);
        } 
        return $output;
    }

    /* Decripta il token da restituire al client */
    public static function DecryptToken(string $data) {
        self::initialize();
        // Logger::Write("Decrypting token.". $data, $GLOBALS["CorrelationID"]); // Add Levels
        $output = openssl_decrypt($data, self::$EncryptMethod, self::$Key, false, self::$Iv);
        return $output;
    }

    /* Genera il token per l'utente corrente */
    public function GenerateTokenForUser($value) {           
        $token = TokenGenerator::EncryptToken(json_encode($value));
        $encodedToken = base64_encode($token);
        return $encodedToken;
    }

    /* Verifica la validità del token fornito nell'header Authorization della request */
    public static function ValidateToken() {
        $res = json_encode(false);
        $encodedCookie = isset($_COOKIE[self::$authCookieName]) ? $_COOKIE[self::$authCookieName] : null;
        if($encodedCookie) {
            $decodedCookie = base64_decode($encodedCookie);
            $validToken = TokenGenerator::DecryptToken($decodedCookie);  
            if($validToken) {
                $res = $validToken;
            }
        }
        Logger::Write("Token is valid", $GLOBALS["CorrelationID"]);
        return $res;
    }

    /* Verifica che l'utente abbia i privilegi specificati nel parametro minimumPermissions */
    public static function CheckPermissions($minimumPermissions, $fieldToCheck) {
        $jsonContext = self::ValidateToken();
        $oContext = json_decode($jsonContext);
        $assoc_array = array();
        foreach($oContext as $key => $value)
        {
            $assoc_array[$key] = $value;
        }
        if(!$oContext || $assoc_array[$fieldToCheck] < $minimumPermissions) {
            Logger::Write(sprintf("Insufficient permissions for user %s (required %d, has %d)", $oContext->username, $minimumPermissions, $oContext->delega_codice), $GLOBALS["CorrelationID"]);
            http_response_code(401);
            exit($GLOBALS["CorrelationID"]);
        }
        Logger::Write(sprintf("Validated permissions for user %s (required %d, has %d)", $oContext->username, $minimumPermissions, $oContext->delega_codice), $GLOBALS["CorrelationID"]);
    }
}
?>