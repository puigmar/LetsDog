'use strict';

class Validator {
    constructor(){
        this.emailExistError = 'Your email already exist!';
        this.invalidEmailError = 'Write a valid email';
        this.passwordError = 'Your password must have at least 6 letters';
        this.repeatPasswordError = `This field doesn't match with your password`;
        this.invalidAccess = 'Your email or your password are incorrect';
        this.emptyNameError = 'This field cannot be empty';
        this.emptySelectValue = 'You have to choose one option';
        
        this.UserErrorFormsStep1 = {
            errorEmailMsg: this.invalidEmailError,
            errorPassMsg: this.passwordError,
            errorPassRepeatMsg: this.repeatPasswordError,
        }

        this.UserErrorFormsStep2 = {
            emptyNameError: this.emptyNameError,
        }

        this.UserErrorFormsStep3 = {
            emptyBreedValue: this.emptySelectValue,
            emptyAgeValue: this.emptySelectValue,
            emptySizeValue: this.emptySelectValue,
        }
    }

    validateEmail = (e, str) => {

        if(!this.emailIsValid(str)){
            this.UserErrorFormsStep1.errorEmailMsg = this.invalidEmailError;
        } else {
            delete this.UserErrorFormsStep1.errorEmailMsg;
        }

        this.checkValidationMsg(e, this.UserErrorFormsStep1.errorEmailMsg || null)

    }

    validateBreedSelect = (e) => {
        if(e.currentTarget.value === 'init'){
            this.UserErrorFormsStep3.emptyBreedValue = this.emptySelectValue
        } else {
            delete this.UserErrorFormsStep3.emptyBreedValue
        }

        this.checkValidationMsg(e, this.UserErrorFormsStep3.emptyBreedValue || null)
    }

    validateAgeSelect = (e) => {
        if(e.currentTarget.value === 'init'){
            this.UserErrorFormsStep3.emptyAgeValue = this.emptySelectValue
        } else {
            delete this.UserErrorFormsStep3.emptyAgeValue
        }

        this.checkValidationMsg(e, this.UserErrorFormsStep3.emptyAgeValue || null)
    }

    validateSizeSelect = (e) => {
        if(e.currentTarget.value === 'init'){
            this.UserErrorFormsStep3.emptySizeValue = this.emptySizeValue
        } else {
            delete this.UserErrorFormsStep3.emptySizeValue
        }

        this.checkValidationMsg(e, this.UserErrorFormsStep3.emptySizeValue || null)
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

    validatePassWord = (e, str) => {
        if(str.length < 6){
            this.UserErrorFormsStep1.errorPassMsg = this.passwordError
        } else {
            delete this.UserErrorFormsStep1.errorPassMsg
        }

        this.checkValidationMsg(e, this.UserErrorFormsStep1.errorPassMsg || null)
    }

    validateRepeatPassword = (e, password, repeatPassword) => {
        if(password !== repeatPassword){
            this.UserErrorFormsStep1.errorPassRepeatMsg = this.repeatPasswordError
        } else {
            delete this.UserErrorFormsStep1.errorPassRepeatMsg
        }

        this.checkValidationMsg(e, this.UserErrorFormsStep1.errorPassRepeatMsg || null)
    }

    validateDogName = (e) => {
        if(e.currentTarget.value === ''){
            console.log('valor: ', e.currentTarget.value)
            this.UserErrorFormsStep2.emptyNameError = this.emptyNameError
        } else {
            delete this.UserErrorFormsStep2.emptyNameError
        }

        this.checkValidationMsg(e, this.UserErrorFormsStep2.emptyNameError || null)
    }

    checkValidationMsg = (e, msgErr) => {

        let formEl = e.target;
        let parent = formEl.parentNode;

        if(msgErr === null || msgErr === undefined){
            msgErr = null
        }
        
        // Comprobamos si sigue existiendo el error
        const findErrorStep1 = this.getErrors(this.UserErrorFormsStep1).find(error => error === msgErr);
        const findErrorStep2 = this.getErrors(this.UserErrorFormsStep2).find(error => error === msgErr);

        if(findErrorStep1 || findErrorStep2 && msgErr !== null){
            if(parent.querySelectorAll('.invalid-feedback').length === 0){
                let msg = document.createElement('div');
                msg.setAttribute('class','invalid-feedback');
                msg.textContent = msgErr;
                parent.appendChild(msg);
            }
            formEl.classList.toggle('is-valid');
            formEl.classList.add('is-invalid');
            formEl.parentNode.classList.toggle('is-error');

        } else if(parent.querySelectorAll('.invalid-feedback').length !== 0){
            
            let errorMsg = parent.querySelector('.invalid-feedback');
            errorMsg.parentNode.removeChild(errorMsg);
            
            formEl.classList.remove('is-invalid')
            formEl.parentNode.classList.remove('is-error')
            formEl.classList.add('is-valid')

        } else {

            formEl.classList.add('is-valid');
        }
    }

    getErrors(object){
        return Object.values(object)
    }

}

const validator = new Validator();