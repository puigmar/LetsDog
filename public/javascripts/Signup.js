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

        this.dogNameInput = document.getElementById('signupDogName');
        this.dogSexInput = document.querySelector('input[name="signupDogSex"]:checked');
        this.dogBreedInput = document.getElementById('signupDogBreed');
        this.dogAgeInput = document.getElementById('signupDogAge');
        this.dogSizeInput = document.querySelector('input[name="signupDogSize"]:checked');
        this.dogBehaviorPeopleInput = document.getElementById('signupDogBehaviorPeople');
        this.dogBehaviorDogsInput = document.getElementById('signupDogBehaviorDogs');



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
        e.preventDefault();
        this.updateDogPhoto()
    }

    addUserData = () => {
        this.userData.email = this.emailInput.value;
        this.userData.password = this.passwordInput.value;
    }

    addDogData = () => {
        this.dogData.photo = this.photoDogUrl;
        this.dogData.name = this.dogNameInput.value;
        this.dogData.sex = this.dogSexInput.value;
        this.dogData.breed = this.dogBreedInput.vaue;
        this.dogData.age = this.dogAgeInput.value;
        this.dogData.size = this.dogSizeInput;
        this.dogData.behavior.withPeople = this.dogBehaviorPeopleInput;
        this.dogData.behavior.withDogs = this.dogBehaviorDogsInput;
    }

    handleIfEmailExists = async (e) => {
        e.preventDefault();
        axios.post('/manage/validate-user', { email: this.emailInput.value })
            .then((response) => {
                if (!response.data) {
                    validator.UserErrorForms.errorEmailMsg = validator.emailExistError;
                    validator.checkValidationMsg(e, validator.emailExistError)
                }
            })
            .catch( err => console.log(err));
    }

    sendSignupFormData = () => {

        this.addUserData();
        this.addDogData();

        axios.post('/signup', {userData = this.userData, dogData = this.dogData})
            .then( () => {
                window.location.href = '/service'
            })
            .catch( err => console.log(err));
            
    }

    addListeners = () => {
        this.photoDogAvatar.addEventListener('click', () => {
            this.photoDogInputFile.click()
        })
        this.photoDogForm.addEventListener('submit', this.sendDogPhoto);
        this.photoDogInputFile.addEventListener('change', () => {
            this.photoDogSubmit.click()
        });
        

        this.signupBtnStep1.addEventListener('click', handleIfEmailExists);
        this.signupBtnStep2.addEventListener('click', )
        this.signupBtnStep2.addEventListener('click', )
    }

    init = () => {
        this.addListeners();
    }

}

const signup = new Signup();
window.addEventListener('load', signup.init())