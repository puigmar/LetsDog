class Signup{
    constructor(){

        this.emailInput = document.getElementById('signupEmailInput');
        this.passwordInput = document.getElementById('signupPasswordInput');
        this.repeatPasswordInput = document.getElementById('signupPasswordRepeatInput');

        this.photoDogAvatar = document.getElementById('photoDogAvatar');
        this.photoDogUrl = document.getElementById('photoDogUrl');
        this.photoDogInputFile = document.getElementById('photoDogInputFile');
        this.photoDogSubmit = document.getElementById('photoDogSubmit');
        this.photoDogForm = document.getElementById('photoDogForm');

        this.signupDogName = document.getElementById('signupDogName');
        this.signupBtnStep1 = document.getElementById('signupBtnStep1');
        this.signupBtnStep3 = document.getElementById('signupBtnStep3');

        this.userData = {
            email: '',
            password: ''
        },
        this.dogData = {
            photo: '',
            name: '',
            age: 0,
            sex: 'macho',
            breed: '',
            size: 'mediano',
            behavior: {
                withDogs: true,
                withPeople: true
            }
        }
    }

    updateDogPhoto = () => {
        console.log('entrando...')
        const dogPhotoToUpload = this.photoDogInputFile.files[0];
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const data = new FormData()
        data.append('image', dogPhotoToUpload);

        axios.post('/manage/validate-dog-photo', data, config)
            .then((response) => {
                this.photoDogUrl = response.data;
                this.photoDogAvatar.style.backgroundImage = `url(${this.photoDogUrl})`;
                this.photoDogAvatar.classList.add('cover')
            })
            .catch(err => {
                console.error("Image post failed: ", err)
            })
    };

    sendDogPhoto = (e) => {
        console.log('estoy en sendDogPhoto')
        e.preventDefault();
        this.updateDogPhoto()
    }

    isEmailExists = (e) => {
        e.preventDefault();
        axios
            .post('/manage/validate-user', { email: this.emailInput.value })
            .then((response) => {
                if (!response.data) {
                    console.log(response.data)
                } else {
                    console.log('no existes');
                    this.userData.email = this.emailInput.value;
                    console.log(this.userData.email)
                }
            });
    }

    addListeners = () => {
        this.photoDogAvatar.addEventListener('click', () => {
            this.photoDogInputFile.click()
        })
        this.photoDogForm.addEventListener('submit', this.sendDogPhoto);
        this.photoDogInputFile.addEventListener('change', () => {
            this.photoDogSubmit.click()
        });
        

        this.signupBtnStep1.addEventListener('click', this.isEmailExists);
    }

    init = () => {
        this.addListeners();
    }

}

const signup = new Signup();
window.addEventListener('load', signup.init())