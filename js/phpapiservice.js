class RestClient {
    static execute(url, data, action) {
        data.action = action;
        var ajaxOptions = {
            url: url,
            data: data,
            type: "POST"
        }
        return $.ajax(ajaxOptions);
    }
}

class AuthenticationService {
    constructor() {
        this.endpoint = "php/AuthenticationService.php";
    }

    login(username, password) {
        var credentials = JSON.stringify({
            username: username,
            password: password
        });
        var data = {
            credentials: credentials
        }
        return RestClient.execute(this.endpoint, data, "login");
    }
}

class VideoRentalService {
    constructor() {

    }

    getField() {
        
    }
}