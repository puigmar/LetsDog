class User{

    constructor(id){

        this.eventEmitCoords = '';
        this.eventEmitWatchCoords = '';
        this.id = id;
        this.startPosition = {
            coordinates: [0,0], // longitude, latitude
            type: 'Point'
        }
        
        this.currentPosition = {
            coordinates: [0,0],
            type: 'Point'
        }
    }

    sendEmitCoords = (event) => {
        this.eventEmitCoords = event;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if(this.startPosition.coordinates[0] && this.startPosition.coordinates[1] === 0){
                    this.startPosition.coordinates[0] = position.coords.longitude;
                    this.startPosition.coordinates[1] = position.coords.latitude;
                }
                
                socket.emit(event, 
                    { 
                        carerId: this.id, 
                        coordinates: [0,0],
                        type: 'Point'
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
                this.currentPosition.coordinates[0] = position.coords.latitude;
                this.currentPosition.coordinates[1] = position.coords.longitude;
                socket.emit(event, 
                    { 
                        carerId: this.id, 
                        coordinates: [0,0],
                        type: 'Point'
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