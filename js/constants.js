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
    }
}

permissions = new Permissions();
placeholders = new Placeholders();