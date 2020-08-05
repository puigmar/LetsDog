class Form {
    constructor (){
        this.parentInputElements = document.querySelectorAll(".form-group.hideAutocomplete");
        this.inputElements = document.querySelectorAll(".form-control");
    }

    disableAutocomplete = () => {
        console.log('hola')
        setTimeout( () => {
            this.inputElements.forEach( input => {
                input.value = "";
            })
        }, 550)

        setTimeout ( () => {
            this.parentInputElements.forEach( parent => {
                parent.classList.remove('hideAutocomplete');
            })
        }, 700)
    }

    addListeners = () => {

        this.inputElements.forEach( input => {
            input.addEventListener('input', (e) => {
                e.target.parentNode.classList.add('is-filled')
            })
            input.addEventListener('focus', (e) => {
                e.target.parentNode.classList.add('is-focus')
            })
        })
    }

    init = () => {
        this.addListeners();
        this.disableAutocomplete();
    }
}

window.addEventListener( 'DOMContentLoaded', function () {
    const form = new Form();
    form.init();
} );