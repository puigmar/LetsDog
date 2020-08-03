class EditCarer{
    constructor(){
        this.emailInput = document.getElementById('signupCarerEmailInput');
        this.nameInput = document.getElementById('signupCarerNameInput');
        this.descriptionInput = document.getElementById('signupCarerDescriptionInput');

        this.photoCarerAvatarPreview = document.getElementById('photoCarerAvatarPreview');
        this.photoCarerAvatarInputFile = document.getElementById('photoCarerAvatarInputFile');
        this.photoCarerAvatarBtnSubmit = document.getElementById('photoCArerAvatarBtnSubmit');
        this.photoCarerAvatarForm = document.getElementById('photoCarerAvatarForm');

        this.photoCarerBannerProfilePreview = document.getElementById('photoCarerBannerProfilePreview');
        this.photoCarerBannerProfileInputFile = document.getElementById('photoCarerBannerProfileInputFile');
        this.photoCarerBannerProfileBtnSubmit = document.getElementById('photoCarerBannerProfileBtnSubmit');
        this.photoCarerBannerProfileForm = document.getElementById('photoCarerBannerProfileForm');

        this.signupCarerBtnForm = document.getElementById('signupCarerBtnForm');

        this.userData = {
            email: '',
            password: '',
            isCarer: true
        }

        this.carerData = {
            name: '',
            profilePhoto: '',
            gallery: '',
            description: '',
            items: {
                ontime: {
                    name: 'Puntual',
                    score: 6
                },
                professional: {
                    name: 'Profesional',
                    score: 6
                },
                loving: {
                    name: 'Cariños@',
                    score: 6
                },
                atentive: {
                    name: 'Atent@',
                    score: 6
                },
                coords: {
                    type: 'Point',
                    coordinates: [0,0]
                }
            },
            coords: {
                type: "Point",
                coordinates: [0,0]
            }
        }
    }

    sendAvatarPhoto = (e) => {
        e.preventDefault();
        this.updatePhoto(
            this.photoCarerAvatarInputFile, this.photoCarerAvatarPreview, '/manage/validate-photo', 'profilePhoto'
        )
    }

    sendBannerProfilePhoto = (e) => {
        e.preventDefault();
        this.updatePhoto(
            this.photoCarerBannerProfileInputFile, this.photoCarerBannerProfilePreview, '/manage/validate-photo', 'gallery'
        )
    }

    updatePhoto = (inputFile, wrapperPreview, postUrl, objKeyName) => {
        const carerPhotoToUpload = inputFile.files[0];
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const data = new FormData()
        data.append('image', carerPhotoToUpload);

        axios.post(postUrl, data, config)
            .then((response) => {
                this.carerData[objKeyName] = response.data;
                wrapperPreview.style.backgroundImage = `url(${this.carerData[objKeyName]})`;
                wrapperPreview.classList.add('cover')
            })
            .catch(err => {c
                console.error("Image post failed: ", err)
            })
    }

    handleIfEmailExists = async (e) => {
        e.preventDefault();
        axios.post('/manage/validate-user?type=carer', { email: this.emailInput.value })
            .then((response) => {
                if (!response.data) {
                    carerValidator.UserErrorForms.errorEmailMsg = carerValidator.emailExistError;
                    carerValidator.checkValidationMsg(e, carerValidator.emailExistError)
                } else {
                    console.log('no existes')
                }
            })
            .catch( err => console.log(err));
    }

    handleEmail = (e) => {
        const email = e.target.value;
        carerValidator.validateEmail(e, email);
        this.checkSubmitButton(this.signupCarerBtnForm, 'UserErrorForms');
    }

    handleDescription = (e) => {
        const description = e.target.value;
        carerValidator.validateEmail(e, description);
        this.checkSubmitButton(this.signupCarerBtnForm, 'UserErrorForms');
    }

    handleName = (e) => {
        const name = e.target.value;
        carerValidator.validateName(e, name);
        this.checkSubmitButton(this.signupCarerBtnForm, 'UserErrorForms');
    }

    handleDescription = (e) => {
        const desc = e.target.value;
        carerValidator.validateDescription(e, desc);
        this.checkSubmitButton(this.signupCarerBtnForm, 'UserErrorForms');
    }

    handlePassword = (e) => {
        const password = e.target.value;
        carerValidator.validatePassWord(e, password);
        this.checkSubmitButton(this.signupCarerBtnForm, 'UserErrorForms');
    }

    handleRepeatPassword = (e) => {
        const repeatPassword = e.target.value;
        const password = this.passwordInput.value;
        carerValidator.validateRepeatPassword(e, password, repeatPassword);
        this.checkSubmitButton(this.signupCarerBtnForm, 'UserErrorForms');
    }

    addUserData = () => {
        this.userData.email = this.emailInput.value;
        this.userData.password = this.passwordInput.value;
    }

    addCarerData = () => {
        this.carerData.email = this.emailInput.value;
        this.carerData.password = this.passwordInput.value;
        this.carerData.name = this.nameInput.value;
        this.carerData.description = this.descriptionInput.value;
    }

    sendSignupFormData = (e) => {
        
        e.preventDefault();
        this.addUserData();
        this.addCarerData();

        console.log(this.userData)
        
        const signupCarerData = {
            userData: {
                ...this.userData
            },
            carerData: {
                ...this.carerData
            }
        };

        console.log('signupCarerData: ',signupCarerData)

        axios.post('/carer/signup', signupCarerData)
            .then( () => {
                window.location.href = '/carer/login'
            })
            .catch( err => console.log(err));

    }

    checkSubmitButton = (button, errors) => {
        const pendentErrors = Object.keys(carerValidator[errors]);
        console.log(pendentErrors)
        if(pendentErrors.length !== 0){
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    }

    addListeners = () => {

        this.emailInput.addEventListener('input', this.handleEmail)
        this.nameInput.addEventListener('input', this.handleName)
        this.descriptionInput.addEventListener('input', this.handleDescription)

        this.photoCarerAvatarPreview.addEventListener('click', () => {
            this.photoCarerAvatarInputFile.click()
        })
        this.photoCarerAvatarForm.addEventListener('submit', this.sendAvatarPhoto);
        this.photoCarerAvatarInputFile.addEventListener('change', () => {
            this.photoCarerAvatarBtnSubmit.click()
        });

        this.photoCarerBannerProfilePreview.addEventListener('click', () => {
            this.photoCarerBannerProfileInputFile.click()
        })
        this.photoCarerBannerProfileForm.addEventListener('submit', this.sendBannerProfilePhoto);
        this.photoCarerBannerProfileInputFile.addEventListener('change', () => {
            this.photoCarerBannerProfileBtnSubmit.click()
        });
        

        this.signupCarerBtnForm.addEventListener('input', this.handleIfEmailExists);
        this.signupCarerBtnForm.addEventListener('click', this.sendSignupFormData);
    }

    init = () => {
        this.addListeners();
    }

}

const editCarer = new EditCarer();
window.addEventListener('load', editCarer.init())