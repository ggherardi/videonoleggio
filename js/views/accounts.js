var accountManagementService = new AccountManagementService();

initAccountManager();

function initAccountManager() {
    accountManagementService.getCities()
        .done((data) => console.log(data))
        .fail((data) => console.log(data));
}