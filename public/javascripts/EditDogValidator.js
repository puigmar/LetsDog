'use strict';

class DogValidator {
    constructor(){
        this.emptyNameError = 'This field cannot be empty';
        this.emptySelectValue = 'You have to choose one option';

        this.DogErrorForms = {
            emptyNameError: this.emptyNameError,
            emptyBreedValue: this.emptySelectValue,
            emptyAgeValue: this.emptySelectValue,
            emptySizeValue: this.emptySelectValue,
        }
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

const dogValidator = new DogValidator();