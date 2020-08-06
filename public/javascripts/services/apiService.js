class ApiService {
    constructor () {
        this.api = axios.create({
            baseURL: ""
        });
    }

    sendUserLocation (userLocArr) {

        return this.api.post(`/manage/check/available-carers`, userLocArr)
            
    }

    getNearestCarers (carersList) {
        
        return this.api.post("manage/check/nearest-carers", carersList)
    }

    sendContractPetition (contract) {
        
        return this.api.post("manage/send/contract-petition", contract)
    }

    getPendingPetitions () {

        return this.api.get("/manage/get/pending-petitions")
    }
}

const apiService = new ApiService ()
