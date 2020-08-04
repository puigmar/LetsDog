class ApiService {
    constructor () {
        this.api = axios.create({
            baseURL: ""
        });
    }

    sendUserLocation (userLocArr) {

    return this.api.post("/manage/check/available-carers", { coordinates: userLocArr })
            
    }
}

const apiService = new ApiService ()
