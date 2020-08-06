class ApiService {
    constructor () {
        this.api = axios.create({
            baseURL: ""
        });
    }

    sendUserLocation (userLocArr) {

        return this.api.post(`/manage/check/available-carers?timestamps=${Date.now()}`, userLocArr)
            
    }

    getNearestCarers (carersList) {
        
        return this.api.post("manage/check/nearest-carers", carersList)
    }
}

const apiService = new ApiService ()
