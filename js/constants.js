class Permissions {
    constructor() {
        this.levels = {
            "addetto": 10,
            "responsabile": 20,
            "proprietario": 30
        }
    }
}

class Placeholders {
    constructor() {
        this.mainContentZone = "#ContentZone0";
        this.sidebar = "#Sidebar";
        this.navbar = "#Navbar";
        this.accounts = {
            mainContainer: "#ManageAccountContainer",
        }
    }
}

class HttpUtilities {
    constructor() {
        this.httpStatusCodes = {
            "unauthorized": 401,
            "internalServerError": 500
        }
    }
}

permissions = new Permissions();
placeholders = new Placeholders();
httpUtilities = new HttpUtilities();