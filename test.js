mapboxgl.accessToken = 'pk.eyJ1IjoicHVpZ21hciIsImEiOiJja2Q1cTRjMHoyOWc1MzBwZzUxNnBqZjgzIn0.Dl_LIKPYzM72_QZAE0wZWQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 0
});

map.on('load', async () => {

    if (navigator.geolocation) {
        console.log('Geolocation is supported!');
    } else {
        console.log('Geolocation is not supported for this Browser/OS version yet.');
    }

    var startPos;
    var latitude;
    var longitude;
    let json = {}

    navigator.geolocation.getCurrentPosition(
        function(position) {

            startPos = position;

            document.getElementById('startLat').innerHTML = startPos.coords.latitude;
            document.getElementById('startLon').innerHTML = startPos.coords.longitude;

            latitude = startPos.coords.latitude;
            longitude = startPos.coords.longitude;
    
            var data = 
            {
                "geometry":{
                    "type":"Point",
                    "coordinates":[
                        latitude,
                        longitude
                    ]
                },
                "type":"Feature",
                "properties":{
                
                }
            };
    
            let noJson = JSON.stringify(data);
            json = JSON.parse(noJson);

            map.addSource('drone', {
                type: 'geojson',
                data: json
            });
    
            map.addLayer({
                'id': 'drone',
                'type': 'symbol',
                'source': 'drone',
                'layout': {
                    'icon-image': 'rocket-15'
                }
            });

        }, function(error) {
            alert('Error occurred. Error code: ' + error.code);
        }
    );

    navigator.geolocation.watchPosition(
        function(position) {
            document.getElementById('currentLat').innerHTML = position.coords.latitude;
            document.getElementById('currentLon').innerHTML = position.coords.longitude;
        }
    );

    navigator.geolocation.watchPosition(
        function(position) {
            // same as above
            document.getElementById('distance').innerHTML =
                calculateDistance(
                    startPos.coords.latitude, 
                    startPos.coords.longitude,
                    position.coords.latitude, 
                    position.coords.longitude
                );

            data = 
            {
                "geometry":{
                    "type":"Point",
                    "coordinates":[
                        position.coords.latitude,
                        position.coords.longitude
                    ]
                },
                "type":"Feature",
                "properties":{
                
                }
            };
            
            function move(_json){
                map.getSource('drone').setData(_json)
                map.flyTo({
                    center: _json.geometry.coordinates,
                    speed: 0.5
                });
            }
        
            window.setInterval(function() {
                move(data);
                console.log('latitude:', latitude)
                console.log('longitude:', longitude)
            }, 2000);
        }
    );

    function calculateDistance(lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = (lat2 - lat1).toRad();
        var dLon = (lon2 - lon1).toRad(); 
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                Math.sin(dLon / 2) * Math.sin(dLon / 2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        var d = R * c;
        return d.toFixed(4);
    }

    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
    
});