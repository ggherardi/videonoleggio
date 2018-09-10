class RestClient {
    constructor() { }

    executeWithoutToken() {
        this.execute();
    }

    executeWithToken() {
        this.getToken();
        this.ajaxOptions = {

        }
        console.log(this.token)
    }

    execute() {
        return $ajax(this.ajaxOptions);
    }

    setAjaxOptions() {
        this.ajaxOptions = {
            url: this.endpoint,
            data: this.data,
            type: "POST"
        }
    }

    getToken() {
        var token = '';
        var loginContext = cookiesManager.getObjectFromCookie(authenticationManager.loginContext);
        if (loginContext !== undefined) {
          cookiesManager.refreshCookie(authenticationManager.loginContext);
          this.token = loginContext.token;
        }
      }
}

class AuthenticationService extends RestClient {
    constructor() {
        super();
        this.endpoint = "php/AuthenticationService.php";
    }

    login(username, password) {
        var credentials = JSON.stringify({
            username: username,
            password: password
        });
        this.data = {
            credentials: credentials,
            action: "login"
        }
        return super.executeWithoutToken();
    }
}

class AccountManagementService extends RestClient {
    constructor() {
        super();
        this.endpoint = "php/AccountManagementService.php";
    }

    getCities() {
        this.data = {
            action: "getCities"
        }
        return super.executeWithToken();        
    }
}

class VideoRentalService {
    constructor() {

    }

    getField() {
        
    }
}