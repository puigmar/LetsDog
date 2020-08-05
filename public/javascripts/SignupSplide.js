class Slider {
    constructor(){
        this.signupBtnStep1 = document.getElementById('btnValidateEmail');
        this.signupBtnContinue = document.getElementById('btnContinueSignup');
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
        signupBtnContinue.addEventListener('click', () => {
            splide.go( '+1' );
            const button = document.getElementById("btnContinueSignup")
            if(splide.index === 2){
                signupBtnContinue.innerHTML = 'Lets Dog!'
            } else {
                signupBtnContinue.innerHTML = 'Continuar'
            }
    
            if(splide.index > 0){
                document.querySelector('h1').innerHTML = 'Registra tu perro';
            } else {
                document.querySelector('h1').innerHTML = 'Regístrate';
            }
        })
    }

    init = () => {
        this.addListeners();
        this.disablePagination();
    }
}