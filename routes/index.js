var journeyModel = require("../models/journeys")
var userModel = require("../models/users")

var express = require('express');
var router = express.Router();

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* 
TODO
- User Sessions
- take care of dates in basket

 */


/* INDEX */
router.get('/', function(req, res, next) {
  res.render('index', { });
});


/* SIGNUP */
router.post('/signup', async function(req, res, next) {

  console.log(req.body)
  var user = userModel.findOne({email: req.body.email, password: req.body.password})

  var newUser = new userModel ({
    email: req.body.email,
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    password: req.body.password
    });
  var userSaved = await newUser.save();


  res.render('index', {});
});


/* SIGNIN */
router.post('/signin', async function(req, res, next) {

  console.log(req.body)
  var user = await userModel.findOne({email: req.body.email, password: req.body.password})
  console.log(user)
  if (user === null) {
    res.redirect('/')
  } else {
    res.render('homepage', {});
  }
});


/* SEARCH PAGE */
router.get('/homepage', function(req, res, next) {



  res.render('homepage', { city:city, date:date });
});


/* RESULT : Either no train or show the trains */
router.post('/search-trip', async function(req, res, next) {

  console.log(req.body)


  var hack_from   = req.body.from
  var hack_to     = req.body.to
  var hack_date   = req.body.date
  
  hack_from       = "Paris"
  hack_to         = "Lille"
  hack_date       = "2018-11-22"

  var journeys_found = await journeyModel.find({
    departure: hack_from,
    arrival: hack_to,
    date: hack_date
  })
  console.log(journeys_found)

  res.render('result', { journeys:journeys_found, date:hack_date });
});


/* RESULT : Either no train or show the trains */
router.get('/add-trip-to-basket', async function(req, res, next) {

  console.log(req.query)

  if (req.session.planned_trips === undefined) {
    req.session.planned_trips = []
  } else {
    
  }
  req.session.planned_trips.push(req.query.id)

  // Fetch data of the planned_trips
  var basket = []

  for (let i=0; i<req.session.planned_trips.length;i++) {
    basket[i] = await journeyModel.findById(req.session.planned_trips[i])
  }

  console.log(basket)
 
  res.render('basket', { basket: basket });
});


















// Remplissage de la base de donnée, une fois suffit
/* router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
}); */
// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.

/* router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
}); */



module.exports = router;
