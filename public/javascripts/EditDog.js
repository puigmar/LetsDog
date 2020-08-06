class EditDog{
    constructor(){
        this.nameInput = document.getElementById('dogNameInput');

        this.photoDogAvatarPreview = document.getElementById('photoDogAvatarPreview');
        this.photoDogAvatarInputFile = document.getElementById('photoDogAvatarInputFile');
        this.photoDogAvatarInputFileUrl = document.getElementById('photoDogAvatarInputFileUrl');
        this.photoDogAvatarBtnSubmit = document.getElementById('photoDogAvatarBtnSubmit');
        this.photoDogAvatarForm = document.getElementById('photoDogAvatarForm');

        this.editableBtn = document.querySelectorAll("[data-type='editable']");
        this.editableFields = document.querySelectorAll("[data-field='editable']");
        this.modifyButton = document.querySelectorAll("[data-btn='modify']");
    }

    sendAvatarPhoto = (e) => {
        e.preventDefault();
        this.updatePhoto(
            this.photoDogAvatarInputFile, this.photoDogAvatarPreview, '/manage/validate-photo'
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
                const url = response.data;
                const inputHiddenId = inputFile.getAttribute('id')+'Url';
                document.getElementById(inputHiddenId).value = url;
                wrapperPreview.style.backgroundImage = `url(${url})`;
                wrapperPreview.classList.add('cover')
            })
            .catch(err => {
                console.error("Image post failed: ", err)
            })
    }

    handleName = (e) => {
        const name = e.target.value;
        dogValidator.validateDogName(e, name);
    }

    modifyField = (e) => {

        if(Object.keys(dogValidator.DogErrorForms).length > 0){
            e.target.disabled = true;
            return
        }
        const targetId = e.target.getAttribute("data-id");
        const inputTarget = document.getElementById(targetId);
        const key = document.getElementById(targetId).getAttribute('name');
        let value = document.getElementById(targetId).value;
        const model = e.target.getAttribute("data-model");

        axios.post(`/manage/updateField/dog`, { model, key, value})
            .then((res) => {
                inputTarget.value = res.data;
                inputTarget.disabled = true;
                inputTarget.classList.toggle('is-valid');
                inputTarget.parentNode.classList.toggle('disabledField')
                e.target.classList.toggle('d-none');
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

    addListeners = () => {

        document.querySelectorAll('.disabledField input').forEach( input => input.disabled = true )
        document.querySelectorAll('.disabledField select').forEach( input => input.disabled = true )
        document.querySelectorAll('.disabledField textarea').forEach( input => input.disabled = true )

        this.modifyButton.forEach(button => button.classList.add('d-none'));
        this.modifyButton.forEach(button => button.addEventListener('click', this.modifyField));
        this.editableBtn.forEach(button => button.addEventListener('click', this.enableEdit));

        this.nameInput.addEventListener('input', this.handleName)

        this.photoDogAvatarPreview.addEventListener('click', () => {
            this.photoDogAvatarInputFile.click()
        })
        this.photoDogAvatarForm.addEventListener('submit', this.sendAvatarPhoto);
        this.photoDogAvatarInputFile.addEventListener('change', () => {
            this.photoDogAvatarBtnSubmit.click()
        });


        this.editableFields.forEach( field => {
            field.addEventListener('change', this.handdleModifyButton)
            field.addEventListener('input', this.handdleModifyButton)
        })
    }

    init = () => {
        dogValidator.DogErrorForms = {}
        this.addListeners();
    }

}

const editDog = new EditDog();
window.addEventListener('load', editDog.init())