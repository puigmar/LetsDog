class Slider {
    constructor(){
        this.signupBtnStep1 = document.getElementById('btnValidateEmail');
        this.signupBtnContinue = document.getElementById('btnContinueSignup2');
        this.signupBtnSubmit = document.getElementById('btnContinueSignup3');
    }

    disablePagination = () => {
        document.querySelectorAll('.splide__pagination__page').forEach(dot => dot.disabled = "true")
    }

    backLink = (index) => {
        if(index > 0) {
            document.getElementById('backLink').classList.add('d-none');
            document.getElementById('backSplide').classList.remove('d-none');

            document.getElementById('backSplide').addEventListener('click', () => {
                splide.go(index-1);
            })

        } else {

            document.getElementById('backLink').classList.remove('d-none');
            document.getElementById('backSplide').classList.add('d-none');

        }
    }

    addListeners = () => {

        this.signupBtnContinue.addEventListener('click', () => {
            console.log('hola')
            splide.go( '+1' );

            if(splide.index === 2){
                this.signupBtnContinue.innerHTML = 'Lets Dog!'
            } else {
                this.signupBtnContinue.innerHTML = 'Continuar'
            }
    
            if(splide.index > 0){
                document.querySelector('h1').innerHTML = 'Registra tu perro';
            } else {
                document.querySelector('h1').innerHTML = 'Regístrate';
            }
        })

        splide.on('move', () => {
            slider.backLink(splide.index);
            if(splide.index === 1){
                this.signupBtnContinue.classList.remove('d-none');
                this.signupBtnSubmit.classList.add('d-none');
                this.signupBtnStep1.classList.add('d-none');
            } else if(splide.index === 2){
                this.signupBtnContinue.classList.add('d-none');
                this.signupBtnStep1.classList.add('d-none');
                this.signupBtnSubmit.classList.remove('d-none');
            } else{
                this.signupBtnContinue.classList.add('d-none');
                this.signupBtnSubmit.classList.add('d-none');
                this.signupBtnStep1.classList.remove('d-none');
            }
        });
    }

    init = () => {
        this.addListeners();
        this.disablePagination();
    }
}