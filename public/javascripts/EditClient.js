class EditClient{
    constructor(){
        this.emailInput = document.getElementById('carerEmailInput');
        this.editableBtn = document.querySelectorAll("[data-type='editable']");
        this.editableFields = document.querySelectorAll("[data-field='editable']");
        this.modifyButton = document.querySelectorAll("[data-btn='modify']");
    }

    handleIfEmailExists = async (e) => {
        e.preventDefault();
        axios.post('/manage/validate-user?type=carer', { email: this.emailInput.value })
            .then((response) => {
                if (!response.data) {
                    userValidator.UserErrorForms.errorEmailMsg = carerValidator.emailExistError;
                    userValidator.checkValidationMsg(e, carerValidator.emailExistError)
                } else {
                    console.log('no existes')
                }
            })
            .catch( err => console.log(err));
    }

    handleEmail = (e) => {
        const email = e.target.value;
        userValidator.validateEmail(e, email);
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


        this.emailInput.addEventListener('input', this.handleEmail);

        this.editableFields.forEach( field => {
            field.addEventListener('change', this.handdleModifyButton)
            field.addEventListener('input', this.handdleModifyButton)
        })
    }

    init = () => {
        userValidator.UserErrorForms = {}
        this.addListeners();
    }

}

const editClient = new EditClient();
window.addEventListener('load', editClient.init())