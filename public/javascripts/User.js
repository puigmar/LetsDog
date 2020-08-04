class User{

    constructor(id){

        this.eventEmitCoords = '';
        this.eventEmitWatchCoords = '';
        this.id = id;
        this.startPosition = {
            geometry: {
                coordinates: [0,0], // longitude, latitude
                type: 'Point'
            }
        }
        
        this.currentPosition = {
            geometry: {
                coordinates: [0,0], // longitude, latitude
                type: 'Point'
            }
        }
    }

    sendEmitCoords = (event) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if(this.startPosition.geometry.coordinates[0] && this.startPosition.geometry.coordinates[1] === 0){
                    this.startPosition.geometry.coordinates[0] = position.coords.longitude;
                    this.startPosition.geometry.coordinates[1] = position.coords.latitude;
                }
                
                socket.emit(event, 
                    { 
                        carerId: this.id, 
                        ...this.startPosition
                    }
                );
            }
        );
        return this.startPosition;
    }

    sendEmitWatchPosition = (event) => {
        navigator.geolocation.watchPosition(
            (position) => {
                this.currentPosition.geometry.coordinates[0] = position.coords.longitude;
                this.currentPosition.geometry.coordinates[1] = position.coords.latitude;
                socket.emit(event, 
                    { 
                        carerId: this.id, 
                        geometry: {
                            coordinates: [this.currentPosition.geometry.coordinates[0],this.currentPosition.geometry.coordinates[1]],
                            type: 'Point'
                        },
                        duration: 0
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

    setStartPosition = (array) => {
        this.currentPosition.coordinates[0] = array[0];
        this.currentPosition.coordinates[1] = array[1];
    }
}