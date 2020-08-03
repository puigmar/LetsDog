class LoginCarer{
    constructor(){
        this.emailInput = document.getElementById('loginCarerEmailInput');
        this.passwordInput = document.getElementById('loginCarerPasswordInput');
        this.loginCarerBtnSubmit = document.getElementById('loginCarerBtnSubmit');
    }

    handleEmail = (e) => {
        const email = e.target.value;

        // validamos con validator
        loginCareValidator.validateEmail(e, email);

        this.checkSubmitButton(this.loginCarerBtnSubmit, 'carerErrorForms');
    }

    handlePassword = (e) => {
        const password = e.target.value;
        // Validamos campo
        loginCareValidator.validatePassWord(e, password);
        this.checkSubmitButton(this.loginCarerBtnSubmit, 'carerErrorForms');
    }

    checkSubmitButton = (button, errors) => {
        const pendentErrors = Object.keys(loginCareValidator[errors]);
        console.log(pendentErrors)
        if(pendentErrors.length !== 0){
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    }

    addListeners = () => {
        this.emailInput.addEventListener('input', this.handleEmail)
        this.passwordInput.addEventListener('input', this.handlePassword)
    }

    init = () => {
        setTimeout(()=> {
            this.emailInput.value = '';
            this.passwordInput.value = '';
        },350)
        this.addListeners();
    }

}

const loginCarer = new LoginCarer();
window.addEventListener('load', loginCarer.init())