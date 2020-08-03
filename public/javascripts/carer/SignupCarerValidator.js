'use strict';

class SignupCarerValidator {
    constructor(){
        this.emailExistError = 'Your email already exist!';
        this.invalidEmailError = 'Write a valid email';
        this.passwordError = 'Your password must have at least 6 letters';
        this.repeatPasswordError = `This field doesn't match with your password`;
        this.invalidAccess = 'Your email or your password are incorrect';
        this.emptyDescriptionError = 'This field cannot be empty';
        this.emptyNameError = 'This field cannot be empty';
        this.emptyPhoneError = 'This field cannot be empty';
        //this.profileImageError = 'You must choice an image';
        
        this.UserErrorForms = {
            errorEmailMsg: this.invalidEmailError,
            errorPassMsg: this.passwordError,
            errorPassRepeatMsg: this.repeatPasswordError,
            emptyDescriptionError: this.emptyDescriptionError,
            emptyNameError: this.emptyNameError,
            emptyPhoneError: this.emptyPhoneError,
            profileImageError: this.profileImageError,
            //avatarImageError: this.profileImageError
        }
        
    }

    validateEmail = (e, str) => {

        if(!this.emailIsValid(str)){
            this.UserErrorForms.errorEmailMsg = this.invalidEmailError;
        } else {
            delete this.UserErrorForms.errorEmailMsg;
        }

        this.checkValidationMsg(e, this.UserErrorForms.errorEmailMsg || null)

    }

    emailIsValid = (email) => {
        // RegEx objeto special - contiene las reglas de la sintaxis
        const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
        
        // metodo `test` prueba si la cadena cumple las reglas
        // y devuelve `true` o `false`
        const isValid = emailRegEx.test(email);
        
        //console.log(`Is a valid email: ${isValid}`)
        return isValid;      
    }

    validatePhoto = (e) => {

    }

    validatePassWord = (e, str) => {
        if(str.length < 6){
            this.UserErrorForms.errorPassMsg = this.passwordError
        } else {
            delete this.UserErrorForms.errorPassMsg
        }

        this.checkValidationMsg(e, this.UserErrorForms.errorPassMsg || null)
    }

    validateName = (e) => {
        if(e.currentTarget.value === ''){
            this.UserErrorForms.emptyNameError = this.emptyNameError
        } else {
            delete this.UserErrorForms.emptyNameError
        }

        this.checkValidationMsg(e, this.UserErrorForms.emptyNameError || null)
    }

    validatePhone = (e) => {
        if(e.currentTarget.value === ''){
            this.UserErrorForms.emptyPhoneError = this.emptyPhoneError
        } else {
            delete this.UserErrorForms.emptyPhoneError
        }

        this.checkValidationMsg(e, this.UserErrorForms.emptyPhoneError || null)
    }

    validateDescription = (e) => {
        if(e.currentTarget.value === ''){
            this.UserErrorForms.emptyDescriptionError = this.emptyDescriptionError
        } else {
            delete this.UserErrorForms.emptyDescriptionError
        }

        this.checkValidationMsg(e, this.UserErrorForms.emptyDescriptionError || null)
    }

    validateRepeatPassword = (e, password, repeatPassword) => {
        if(password !== repeatPassword){
            this.UserErrorForms.errorPassRepeatMsg = this.repeatPasswordError
        } else {
            delete this.UserErrorForms.errorPassRepeatMsg
        }

        this.checkValidationMsg(e, this.UserErrorForms.errorPassRepeatMsg || null)
    }

    checkValidationMsg = (e, msgErr) => {

        let formEl = e.target;
        let parent = formEl.parentNode;

        if(msgErr === null || msgErr === undefined){
            msgErr = null
        }
        
        // Comprobamos si sigue existiendo el error
        if(this.getErrors(this.UserErrorForms).find(error => error === msgErr) && msgErr !== null){
            if(parent.querySelectorAll('.invalid-feedback').length === 0){
                let msg = document.createElement('div');
                msg.setAttribute('class','invalid-feedback');
                msg.textContent = msgErr;
                parent.appendChild(msg);
            }
            formEl.classList.toggle('is-valid');
            formEl.classList.add('is-invalid');

        } else if(parent.querySelectorAll('.invalid-feedback').length !== 0){
            
            let errorMsg = parent.querySelector('.invalid-feedback');
            errorMsg.parentNode.removeChild(errorMsg);
            
            formEl.classList.remove('is-invalid')
            formEl.classList.add('is-valid')

        } else {

            formEl.classList.add('is-valid');
        }
    }

    getErrors(object){
        return Object.values(object)
    }

}

const carerValidator = new SignupCarerValidator();