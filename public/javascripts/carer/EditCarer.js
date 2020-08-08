class EditCarer{
    constructor(){
        this.emailInput = document.getElementById('carerEmailInput');
        this.nameInput = document.getElementById('carerNameInput');
        this.descriptionInput = document.getElementById('carerDescriptionInput');
        this.phoneNumber = document.getElementById('carerPhoneInput');

        this.profileHeroBanner = document.querySelector('.profile-heroBanner');

        this.photoCarerAvatarPreview = document.getElementById('photoCarerAvatarPreview');
        this.photoCarerAvatarInputFile = document.getElementById('photoCarerAvatarInputFile');
        this.photoCarerAvatarInputFileUrl = document.getElementById('photoCarerAvatarInputFileUrl');
        this.photoCarerAvatarBtnSubmit = document.getElementById('photoCarerAvatarBtnSubmit');
        this.photoCarerAvatarForm = document.getElementById('photoCarerAvatarForm');
        this.photoCarerAvatarBtnUpdate = document.getElementById('photoCarerAvatarBtnUpdate');

        this.photoCarerBannerProfilePreview = document.getElementById('photoCarerBannerProfilePreview');
        this.photoCarerBannerProfileInputFile = document.getElementById('photoCarerBannerProfileInputFile');
        this.photoCarerBannerProfileBtnSubmit = document.getElementById('photoCarerBannerProfileBtnSubmit');
        this.photoCarerBannerProfileForm = document.getElementById('photoCarerBannerProfileForm');
        this.photoCarerBannerProfileBtnUpdate = document.getElementById('photoCarerBannerProfileBtnUpdate');

        this.editableBtn = document.querySelectorAll("[data-type='editable']");
        this.editableFields = document.querySelectorAll("[data-field='editable']");
        this.modifyButton = document.querySelectorAll("[data-btn='modify']");
    }

    sendAvatarPhoto = (e) => {
        e.preventDefault();
        this.updatePhoto(
            this.photoCarerAvatarInputFile, 
            this.photoCarerAvatarPreview, 
            '/manage/validate-photo', 
            this.photoCarerAvatarBtnUpdate
        )
    }

    sendBannerProfilePhoto = (e) => {
        e.preventDefault();
        this.updatePhoto(
            this.photoCarerBannerProfileInputFile, 
            this.photoCarerBannerProfilePreview, 
            '/manage/validate-photo', 
            this.photoCarerBannerProfileBtnUpdate
        )
    }

    updatePhoto = (inputFile, wrapperPreview, postUrl, updateBtn) => {
        const carerPhotoToUpload = inputFile.files[0];
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const data = new FormData()
        data.append('image', carerPhotoToUpload);
        wrapperPreview.classList.add('loading');

        axios.post(postUrl, data, config)
            .then((response) => {

                const url = response.data;
                const inputHiddenId = inputFile.getAttribute('id')+'Url';
                document.getElementById(inputHiddenId).value = url;
                wrapperPreview.style.backgroundImage = `url(${url})`;
                wrapperPreview.classList.add('cover')
                wrapperPreview.classList.remove('loading');

                // boton que activa el método modifyField
                updateBtn.click();
                    
            })
            .catch(err => {
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
    }

    handleDescription = (e) => {
        const description = e.target.value;
        carerValidator.validateEmail(e, description);
    }

    handleName = (e) => {
        const name = e.target.value;
        carerValidator.validateName(e, name);
    }

    handleDescription = (e) => {
        const desc = e.target.value;
        carerValidator.validateDescription(e, desc);
    }

    handdleModifyButton = (e) => {
        const parent = e.currentTarget.parentNode;
        console.log(parent);
        const btn = parent.querySelector('[data-btn]')
        if(Object.keys(carerValidator.UserErrorForms).length === 0){
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
        console.log(Object.keys(carerValidator.UserErrorForms).length)
    }

    modifyField = (e) => {

        if(Object.keys(carerValidator.UserErrorForms).length > 0){
            e.target.disabled = true;
            return
        }
        const targetId = e.target.getAttribute("data-id");
        const inputTarget = document.getElementById(targetId);
        const key = document.getElementById(targetId).getAttribute('name');
        let value = document.getElementById(targetId).value;
        const model = e.target.getAttribute("data-model");

        axios.post(`/manage/updateField/carer`, { model, key, value})
            .then((res) => {
                inputTarget.value = res.data;
                inputTarget.disabled = true;
                inputTarget.classList.toggle('is-valid');
                inputTarget.parentNode.classList.toggle('disabledField')
                e.target.classList.toggle('d-none');

                if(key === 'gallery'){
                    this.profileHeroBanner.style.backgroundImage = `url('${value}')`
                }
            })
            .catch( err => console.log(err));
    }

    enableEdit = (e) => {
        const elId = e.currentTarget.getAttribute('data-id');
        console.log(elId)
        document.getElementById(elId).disabled = !document.getElementById(elId).disabled;
        e.currentTarget.parentNode.parentNode.classList.toggle('disabledField')
        const parent = e.currentTarget.parentNode.parentNode;
        parent.querySelector('[data-btn]').classList.toggle('d-none')
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

    addListeners = () => {

        document.querySelectorAll('.disabledField input').forEach( input => input.disabled = true )
        document.querySelectorAll('.disabledField select').forEach( input => input.disabled = true )
        document.querySelectorAll('.disabledField textarea').forEach( input => input.disabled = true )
        this.modifyButton.forEach(button => button.classList.add('d-none'));
        this.modifyButton.forEach(button => button.addEventListener('click', this.modifyField));
        this.editableBtn.forEach(button => button.addEventListener('click', this.enableEdit));

        this.emailInput.addEventListener('input', this.handleEmail);
        this.nameInput.addEventListener('input', this.handleName)
        this.descriptionInput.addEventListener('input', this.handleDescription)
        this.descriptionInput.addEventListener('input', this.handleDescription)

        this.photoCarerAvatarPreview.addEventListener('click', () => {
            this.photoCarerAvatarInputFile.click()
        })
        this.photoCarerAvatarForm.addEventListener('submit', this.sendAvatarPhoto);
        this.photoCarerAvatarInputFile.addEventListener('change', () => {
            this.photoCarerAvatarBtnSubmit.click()
        });

        this.photoCarerBannerProfilePreview.addEventListener('click', () => {
            console.log('click')
            this.photoCarerBannerProfileInputFile.click()
        })
        this.photoCarerBannerProfileForm.addEventListener('submit', this.sendBannerProfilePhoto);
        this.photoCarerBannerProfileInputFile.addEventListener('change', () => {
            this.photoCarerBannerProfileBtnSubmit.click()
        });

        this.editableFields.forEach( field => {
            field.addEventListener('change', this.handdleModifyButton)
            field.addEventListener('input', this.handdleModifyButton)
        })
    }

    init = () => {
        carerValidator.UserErrorForms = {}
        this.addListeners();
    }

}

const editCarer = new EditCarer();
window.addEventListener('load', editCarer.init())