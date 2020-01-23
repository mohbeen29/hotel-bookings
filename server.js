const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser')
const fs = require("fs");

const app = express();
app.use(bodyParser.json());


app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function(request, response){
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});
// TODO add your routes and helper functions here



//To read all.
app.get('/bookings', function (request, response){
  response.json(bookings).status(200)
})

const bookingIsValid = (booking) => {
  console.log(booking);
 if (booking.id && booking.id !== "" && booking.title && booking.title !== "" && booking.firstName && booking.firstName !== "" && booking.surname && booking.surname !== "" && booking.email && booking.email !== "" && booking.roomId && booking.roomId !== "" && booking.checkInDate && booking.checkInDate !== "" && booking.checkOutDate && booking.checkOutDate !== "" ) {
   return true;
 } else {
   return false;
 }
}


app.post('/bookings', function (request, response){
  if (bookingIsValid(request.body)){
    bookings.push(request.body)
    response.sendStatus(200)
  } else {
    response.sendStatus(400)
  }
}
)


//to read specific
app.get('/bookings/:id/', function (request,response) {
  const specific = request.params.id;

  const found = bookings.find(function(booking) {
     return booking.id == specific;
  })

  if (found) {
    return response.status(200).json(found)
  } else  {
    return response.status(404)
  }
})

//delete specific
//add prop
app.delete('/bookings/:id', function (request,response) {
  const idToDelete = request.params.id;
  const bookingToDelete = bookings.find(function(booking){
    return booking.id == idToDelete;
  })

  //label to delete
  bookingToDelete.deleted = true
  console.log(bookingToDelete)
  console.log(bookings)
    if (bookingToDelete) {
      fs.writeFile("amendedBookings.json", JSON.stringify(bookings), (err) => {
    // throws an error, you could also catch it here
         if (err) throw err;})
      //make the memory version now the amended file one.
      return response.sendStatus(200)
    } else  {
      return response.sendStatus(404)
    }
});

app.listen(3000)
