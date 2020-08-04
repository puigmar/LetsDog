class User{

    constructor(id){

        this.eventEmitCoords = '';
        this.eventEmitWatchCoords = '';
        this.id = id;
        this.startPosition = {
          coords: {
              latitude: 0,
              longitude: 0 
          }  
        }

        this.currentPosition = {
            coords: {
                latitude: 0,
                longitude: 0 
            }  
        }
    }

    sendEmitCoords = (event) => {
        this.eventEmitCoords = event;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.startPosition.coords.latitude = position.coords.latitude;
                this.startPosition.coords.longitude = position.coords.longitude;
                socket.emit(event, 
                    { 
                        carerId: this.id, 
                        latitude: this.startPosition.coords.latitude, 
                        longitude: this.startPosition.coords.longitude 
                    }
                );
            }
        );
        return this.startPosition;
    }

    sendEmitWatchPosition = (event) => {
        this.eventEmitWatchCoords = event;
        navigator.geolocation.watchPosition(
            (position) => {
                this.currentPosition.coords.latitude = position.coords.latitude;
                this.currentPosition.coords.longitude = position.coords.longitude;
                socket.emit(event, 
                    { 
                        carerId: this.carerId, 
                        latitude: position.coords.latitude, 
                        longitude: position.coords.longitude 
                    }
                );
            }
        ); 
    }

    getStartPosition = () => {
        return this.startPosition;
    }

    getCurrentPosition = () => {
        return this.currentPosition;
    }
}