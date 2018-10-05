var bookingManagementService = bookingManagementService || new BookingManagementService();

function initHome() {
    bookingManagementService.getComingSoonMovies(sharedStorage.loginContext.punto_vendita_id_punto_vendita)
        .done(initHomeSuccess)
        .fail(RestClient.redirectIfUnauthorized);
}

function initHomeSuccess(data) {
    if(data) {
        var array = JSON.parse(data);
        for(var i = 0; i < array.length; i++) {
            console.log(array[i]);
        }
        // $("#ComingSoonMoviesAlert").text(`ATTENZIONE! Il film ${} esce il ${} e sono state prenotate ${} copie. Ricordarsi di scaricarle.`);
    }    
}

/* Init */
initHome();