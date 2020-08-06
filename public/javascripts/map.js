const session = "{{currentUserInfo.userData._id}}";

// const theUser = new User('{{currentUserInfo.user._id}}');
// theUser.sendEmitCoords('user-online');
// theUser.sendEmitWatchPosition('user-online-moving');

const updateContractMeetingPoint = (meetingPoint) => {
  let retrievedObject = localStorage.getItem("contract");
  let contract = JSON.parse(retrievedObject);
  console.log(meetingPoint);
  contract = {
    ...contract,
    meeting_point: meetingPoint.result.place_name,
    geometry: meetingPoint.result.geometry.coordinates,
  };
  console.log(contract);
  localStorage.setItem("contract", JSON.stringify(contract));
};

const generateCarersList = (meetingPoint) => {
  const userLocation = meetingPoint.result.geometry.coordinates;
  console.log(userLocation);
  return userLocation;
};

mapboxgl.accessToken =
  "pk.eyJ1IjoicHVpZ21hciIsImEiOiJja2Q1cTRjMHoyOWc1MzBwZzUxNnBqZjgzIn0.Dl_LIKPYzM72_QZAE0wZWQ";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [2.15899, 41.38879],
  zoom: 12,
});

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  })
);

var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  marker: false,
  mapboxgl: mapboxgl,
});
console.log("QUI------>", geocoder);

document.getElementById("geocoder").appendChild(geocoder.onAdd(map));

geocoder.on("result", (e) => {
  var meetingPoint = e;
  updateContractMeetingPoint(meetingPoint);
  const userLocArr = generateCarersList(meetingPoint);

  var el = document.createElement("div");
  el.className = "marker";

  var customMarkerCoord = e.result.geometry.coordinates;

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el).setLngLat(customMarkerCoord).addTo(map);

  document.getElementById("search-carers").addEventListener("click", () => {
    apiService
      .sendUserLocation(userLocArr)
      .then(async (res) => {
        console.log(res);
        await generateDOMCarersList(res.data, "availableCarersList");
        document
          .querySelector(".v-service-map-location")
          .classList.add("toCarerList");
      })
      .catch((err) => console.log(err));
  });
});

function getPointData(lngLat) {
  return {
    type: "Point",
    coordinates: [lngLat.coords.longitude, lngLat.coords.latitude],
  };
}

//var socket = io("");

map.on("load", function () {
  var startPos;
  var latitude;
  var longitude;
  var coordsClick;

  document
    .querySelector(".mapboxgl-ctrl-geocoder--input")
    .addEventListener("click", (e) => {
      const inputBtn = e.currentTarget.parentNode;
      inputBtn.querySelector(".suggestions-wrapper").classList.add("show");
    });

  navigator.geolocation.getCurrentPosition(
    function (position) {
      startPos = position;
      coordsClick = getPointData(startPos);

      map.addSource("point_source", {
        type: "geojson",
        data: coordsClick,
      });

      socket.emit("onlineUser", {
        userId: `{{currentUserInfo.user._id}}`,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      socket.on("user:join", (m) => console.log("Exist a new user: ", m));
    },
    function (error) {
      alert("Error occurred. Error code: " + error.code);
    }
  );

  navigator.geolocation.watchPosition(function (position) {
    socket.on("showOnlineUsers", (data) => {
      console.log("data from socket.io: ", data);

      map.getSource("point_source").setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [data.longitude, data.latitude],
            },
          },
        ],
      });

      map.flyTo({
        center: [data.longitude, data.latitude],
        speed: 0.5,
      });

      socket.emit("onlineUser", {
        userId: `{{currentUserInfo.user._id}}`,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  });
});

socket.on("user:left", (data) =>
  console.log("usario ha dejado la sesion: ", data)
);

const generateDOMCarersList = (arr, wrapper) => {
  
  const carer = arr.result;
  console.log(carer)
  
  

  const parent = document.getElementById(wrapper);
  //let carerBlock = document.createElement("div");
  //carerBlock.className = "carerCard";
  //carerBlock.setAttribute("href", `/carer-profile`);
  let counter = "";

  carer.forEach((carers, i) => {
    console.log(carers.carers['0'].name)
    counter += `
    <a class="carerCard" href="/carer-profile/${carers.carers['0'].userId}">
      <div class="carerCard_details">
        <div class="carerCard_bubleTime">
            <div class="carerCard_buble">
                <span class="icon-countDownClok"></span>
            </div>
            <span class="carerCard_bubleTime_timeTo">en ${carers.duration}</span>
        </div>
        <div class="carerCard_Intro">
            <div class="carerCard_Intro_content">
                <div class="carerCard_Intro_detail">
                    <h3 class="carerCard_Intro_name">${carers.carers['0'].name}</h3>
                    <p class="carerCard_Intro_lastReview">${carers.carers['0'].name}</p>
                </div>
                <div class="carerCard_Intro_avatar">
                    <div class="avatar" style="background-image: url(${carers.carers['0'].profilePhoto})"></div>
                </div>
            </div>
            <div class="carerCard_feedback">
                <div class="carerCard_feedback_averageBones">
                    <span class="icon-bone"></span><span class="icon-bone"></span><span class="icon-bone"></span><span class="icon-bone"></span><span class="icon-bone"></span>
                </div>
                <div class="carerCard_feedback_nums">
                    <div class="carerCard_feedback_averageScore">${carers.carers['0'].rate}</div>
                    <div class="carerCard_feedback_numReviews">40 reseñas</div>
                </div>
            </div>
        </div>
      </div>
    </a>
    `;

  });

  
  parent.innerHTML = counter ;
};
