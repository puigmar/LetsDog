
let users = [],
    users_connected = [],
    carers_connected = [];

io.on('connection', (socket) => {

  var uid = null;

  for(let i = 0; i < users_connected.length; i++) {
    socket.emit("showOnlineUsers", users_connected[i]);
  }

  socket.on('carer-online', carerData => {
    carers_connected.push(carerData);
    console.log('carers_connected: ',carers_connected)
  })

  socket.on('carer-online-moving', carerData => {
    console.log('antes de: ', carers_connected)
    let arrayCarrerIndex = carers_connected.forEach( (carer, index) => {
      if(carer.userId === carerData.userId){
        carers_connected[index].latitude = carerData.latitude;
        carers_connected[index].longitude = carerData.longitude;
      }
    })
    console.log('después de: ', carers_connected)
  })

  socket.on('disconnect', userId => {

    carers_connected.splice( carers_connected.indexOf(userId), 1);

    console.log('Current Connected Users:');
    console.log(users_connected);
    console.log('num connected: ', users_connected);

  })


});