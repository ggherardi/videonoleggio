class RestClient {
    constructor() { }

    execute() {
        var ajaxOptions = {
            url: this.endpoint,
            data: this.data,
            type: "POST"
        }
        return $.ajax(ajaxOptions);
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
        return super.execute();
    }
}

class AccountManagementService extends RestClient {
    constructor() {
        super();
        this.endpoint = "php/AccountManagementService.php;"
    }

    getCities() {
        this.data = {
            action: "getCities"
        }
        return super.execute();        
    }
}

class VideoRentalService {
    constructor() {

    }

    getField() {
        
    }
}