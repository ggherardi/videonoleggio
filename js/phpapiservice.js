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

    getAllFilms() {
        this.data = {
            action: "getAllFilms"
        }
        return super.executeWithToken();
    }

    getAllSuppliers() {
        this.data = {
            action: "getAllSuppliers"
        }
        return super.executeWithToken();
    }

    getAllCustomers() {
        this.data = {
            action: "getAllCustomers"
        }
        return super.executeWithToken();
    }
    
    getAllDiscounts() {
        this.data = {
            action: "getAllDiscounts"
        }
        return super.executeWithToken();
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

class StorageManagementService extends RestClient {
    constructor() {
        super();
        this.endpoint = "php/StorageManagementService.php";
    }

    getVideosInStorage(filters) {
        filters = JSON.stringify(filters);
        this.data = {
            action: "getVideosInStorage",
            filters: filters
        }
        return super.executeWithToken();        
    }

    getAlreadyAvailableMovies() {
        this.data = {
            action: "getAlreadyAvailableMovies",
        }
        return super.executeWithToken();        
    }

    unloadCopies(copies) {
        copies = JSON.stringify(copies);
        this.data = {
            action: "unloadCopies",
            copies: copies
        }
        return super.executeWithToken();        
    }

    loadCopies(copies) {
        copies = JSON.stringify(copies);
        this.data = {
            action: "loadCopies",
            copies: copies
        }
        return super.executeWithToken();        
    }
}

class CustomersManagementService extends RestClient {
    constructor() {
        super();
        this.endpoint = "php/CustomerManagementService.php";
    }

    getAllCustomersWithPremiumCode() {
        this.data = {
            action: "getAllCustomersWithPremiumCode"
        }
        return super.executeWithToken();        
    }

    insertNewCustomer(customer, file) {
        this.data = new FormData();
        this.data.append('file', file);
        this.data.append('customer', JSON.stringify(customer));
        this.data.append('action', 'insertNewCustomer');
        this.ajaxOptions.processData = false;
        this.ajaxOptions.contentType = false;
        return super.executeWithToken();        
    }

    deleteCustomer(id_cliente) {
        this.data = {
            action: "deleteCustomer",
            id_cliente: id_cliente
        }
        return super.executeWithToken();        
    }

    editCustomer(customer, file) {
        this.data = new FormData();
        this.data.append('file', file);
        this.data.append('customer', JSON.stringify(customer));
        this.data.append('action', 'editCustomer');
        this.ajaxOptions.processData = false;
        this.ajaxOptions.contentType = false;
        return super.executeWithToken();        
    }
}

class VideoRentalService extends RestClient {
    constructor() {

    }

    getField() {
        
    }
}