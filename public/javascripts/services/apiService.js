class ApiService {
    constructor () {
        this.api = axios.create({
            baseURL: ""
        });
    }

    sendUserLocation (userLocArr) {

        return this.api.post("/manage/check/available-carers", userLocArr)
            
    }

    getNearestCarers (carersList) {
        
        return this.api.post("manage/check/nearest-carers", carersList)
    }
}

const apiService = new ApiService ()
