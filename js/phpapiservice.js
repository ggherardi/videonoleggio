class AuthenticationService {
    constructor() {
        this.endpoint = "php/AuthenticationService.php";
    }

    getField() {
        var action = "";
        $.ajax({
            url: this.endpoint,
            success: function(data) {
                console.log(data);
            }
        });
    }
}

class VideoRentalServce {
    constructor() {

    }

    getField() {
        
    }
}