class RestClient {
    constructor() {
        this.ajaxOptions = {};
     }

    executeWithoutToken() {
        return this.execute();
    }

    executeWithToken() {
        this.getToken();
        this.ajaxOptions.headers = {
            AUTHORIZATION: `bearer ${this.token}`
        }
        return this.execute();
    }

    execute() {
        this.setAjaxOptions();
        return $.ajax(this.ajaxOptions);
    }

    setAjaxOptions() {
        this.ajaxOptions.url = this.endpoint,
        this.ajaxOptions.data = this.data,
        this.ajaxOptions.type = "POST";
    }

    getToken() {
        var token = '';
        var loginContext = cookiesManager.getObjectFromCookie(authenticationManager.loginContext);
        if (loginContext !== undefined) {
          cookiesManager.refreshCookie(authenticationManager.loginContext, 12);
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

    getStores(id_citta) {
        this.data = {
            action: "getStores",
            id_citta: id_citta
        }
        return super.executeWithToken();
    }

    getEmployees(id_punto_vendita) {
        this.data = {
            action: "getEmployees",
            id_punto_vendita: id_punto_vendita
        }
        return super.executeWithToken();
    }

    deleteEmployee(id_dipendente) {
        this.data = {
            action: "deleteEmployee",
            id_dipendente: id_dipendente
        }
        return super.executeWithToken();
    }

    insertEmployee(dipendente) {
        dipendente = JSON.stringify(dipendente);
        this.data = {
            action: "insertEmployee",
            dipendente: dipendente
        }
        return super.executeWithToken();
    }

    editEmployee(dipendente) {
        dipendente = JSON.stringify(dipendente);
        this.data = {
            action: "editEmployee",
            dipendente: dipendente
        }
        return super.executeWithToken();
    }

    resetPassword(id_dipendente) {
        this.data = {
            action: "resetPassword",
            id_dipendente: id_dipendente
        }
        return super.executeWithToken();
    }
}

class GetAllItemsService extends RestClient {
    constructor() {
        super();
        this.endpoint = "php/GetAllItemsService.php";
    }

    getAllCities() {
        this.data = {
            action: "getAllCities"
        }
        return super.executeWithToken();        
    }

    getAllStores() {
        this.data = {
            action: "getAllStores"
        }
        return super.executeWithToken();
    }

    getAllEmployees() {
        this.data = {
            action: "getAllEmployees"
        }
        return super.executeWithToken();
    }

    getAllRoles() {
        this.data = {
            action: "getAllRoles"
        }
        return super.executeWithToken();
    }
}

class VideoRentalService extends RestClient {
    constructor() {

    }

    getField() {
        
    }
}