class RestClient {
    constructor() {
        this.ajaxOptions = {};
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
        return super.execute();        
    }

    getAllStores() {
        this.data = {
            action: "getAllStores"
        }
        return super.execute();
    }

    getAllEmployees() {
        this.data = {
            action: "getAllEmployees"
        }
        return super.execute();
    }

    getAllRoles() {
        this.data = {
            action: "getAllRoles"
        }
        return super.execute();
    }

    getAllFilms() {
        this.data = {
            action: "getAllFilms"
        }
        return super.execute();
    }

    getAllSuppliers() {
        this.data = {
            action: "getAllSuppliers"
        }
        return super.execute();
    }

    getAllCustomers() {
        this.data = {
            action: "getAllCustomers"
        }
        return super.execute();
    }
    
    getAllDiscounts() {
        this.data = {
            action: "getAllDiscounts"
        }
        return super.execute();
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

    logout() {
        this.data = {
            action: "logout"
        };
        return super.execute();
    }

    authenticateUser() {
        this.data = {
            action: "authenticateUser"
        }
        return super.execute();
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
        return super.execute();        
    }

    getStores(id_citta) {
        this.data = {
            action: "getStores",
            id_citta: id_citta
        }
        return super.execute();
    }

    getEmployees(id_punto_vendita) {
        this.data = {
            action: "getEmployees",
            id_punto_vendita: id_punto_vendita
        }
        return super.execute();
    }

    deleteEmployee(id_dipendente) {
        this.data = {
            action: "deleteEmployee",
            id_dipendente: id_dipendente
        }
        return super.execute();
    }

    insertEmployee(dipendente) {
        dipendente = JSON.stringify(dipendente);
        this.data = {
            action: "insertEmployee",
            dipendente: dipendente
        }
        return super.execute();
    }

    editEmployee(dipendente) {
        dipendente = JSON.stringify(dipendente);
        this.data = {
            action: "editEmployee",
            dipendente: dipendente
        }
        return super.execute();
    }

    resetPassword(id_dipendente) {
        this.data = {
            action: "resetPassword",
            id_dipendente: id_dipendente
        }
        return super.execute();
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
        return super.execute();        
    }

    getAlreadyAvailableMovies() {
        this.data = {
            action: "getAlreadyAvailableMovies",
        }
        return super.execute();        
    }

    unloadCopies(copies) {
        copies = JSON.stringify(copies);
        this.data = {
            action: "unloadCopies",
            copies: copies
        }
        return super.execute();        
    }

    loadCopies(copies) {
        copies = JSON.stringify(copies);
        this.data = {
            action: "loadCopies",
            copies: copies
        }
        return super.execute();        
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
        return super.execute();        
    }

    insertNewCustomer(customer, file) {
        this.data = new FormData();
        this.data.append('file', file);
        this.data.append('customer', JSON.stringify(customer));
        this.data.append('action', 'insertNewCustomer');
        this.ajaxOptions.processData = false;
        this.ajaxOptions.contentType = false;
        var promise = super.execute();
        this.ajaxOptions.processData = true;
        this.ajaxOptions.contentType = true;
        return promise;        
    }

    deleteCustomer(id_cliente) {
        this.data = {
            action: "deleteCustomer",
            id_cliente: id_cliente
        }
        return super.execute();        
    }

    editCustomer(customer, file) {
        this.data = new FormData();
        this.data.append('file', file);
        this.data.append('customer', JSON.stringify(customer));
        this.data.append('action', 'editCustomer');
        this.ajaxOptions.processData = false;
        this.ajaxOptions.contentType = false;
        return super.execute();        
    }

    findCustomerById(id_cliente) {
        this.data = {
            action: "findCustomerById",
            id_cliente: id_cliente
        }
        return super.execute();   
    }
}

class RentalManagementService extends RestClient {
    constructor() {
        super();
        this.endpoint = "php/RentalManagementService.php";
    }

    getVideosInStorageWithCount(filters) {
        filters = JSON.stringify(filters);
        this.data = {
            action: "getVideosInStorageWithCount",
            filters: filters
        }
        return super.execute();        
    }

    clearRentalBookings() {
        this.data = {
            action: "clearRentalBookings"
        }
        return super.execute();
    }

    clearRentalBookingsForUser(id_dipendente) {
        this.data = {
            action: "clearRentalBookingsForUser",
            id_dipendente: id_dipendente
        }
        return super.execute();
    }

    getMostRecentCopies(filters) {
        filters = JSON.stringify(filters);
        this.data = {
            action: "getMostRecentCopies",
            filters: filters
        }
        return super.execute();
    }

    getActiveDiscount() {
        this.data = {
            action: "getActiveDiscount",
        }
        return super.execute();        
    }

    rentVideos(videos) {
        videos = JSON.stringify(videos);
        this.data = {
            action: "rentVideos",
            videos: videos
        }
        return super.execute();
    }
}