var journeyModel = require("../models/journeys")
var userModel = require("../models/users")

var express = require('express');
var router = express.Router();

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* 
TODO
- User Sessions (stock also the id for the calls)
- adjust user id in calls
- style the nav items
 */


/* INDEX */
router.get('/', function(req, res, next) {
  res.render('index', { });
});

router.get('/logout', function(req, res, next) {
  req.session.user = []
  req.session.user_logged = false
  res.redirect('/');
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

  req.session.user_logged = false
  var user = await userModel.findOne({email: req.body.email, password: req.body.password})
  if (user === null) {
    res.redirect('/')
  } else {
    req.session.user = user
    req.session.user_logged = true
    res.render('homepage', {city:city, date:date});
  }
});


/* SEARCH PAGE */
router.get('/homepage', function(req, res, next) {
  if (req.session.user_logged === true) {
    res.render('homepage', { city:city, date:date });
  } else {
    res.redirect('/')
  }
});


/* RESULT : Either no train or show the trains */
router.post('/search-trip', async function(req, res, next) {
  if (req.session.user_logged === true) {
    var from   = req.body.from
    var to     = req.body.to
    var date   = req.body.date
    
    if (req.body.from === "") {from = "Paris"}
    if (req.body.to   === "") {to   = "Lille"}
    if (req.body.date === "") {date = "2018-11-22"}

    var journeys_found = await journeyModel.find({
      departure: from,
      arrival: to,
      date: date
    })
    console.log(journeys_found)

    res.render('result', { journeys:journeys_found, date:date });
  
  } else {
    res.redirect('/')
  }
  
});


/* RESULT : Either no train or show the trains */
router.get('/add-trip-to-basket', async function(req, res, next) {

  if (req.session.user_logged === true) {
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
  
  } else {
    res.redirect('/')
  }
  
});


/* PAYMENT CONFIRM */
router.get('/payment-confirm', async function(req, res, next) {

  if (req.session.user_logged === true) {
    console.log(req.query.data)
    var trips_to_save = JSON.parse(req.query.data)
    console.log(trips_to_save)
    
    req.session.planned_trips = []

    var fake_id = "61f27f8b864b0c0b1e5c73bf"
    // Fetch user
    var user = await userModel.findById(fake_id)

    // Update user trips
    for (let i=0; i<trips_to_save.length;i++){
      user.trips.push(trips_to_save[i])
    }

    // Save user trips
    await userModel.updateOne(
      { _id: fake_id},
      { trips: user.trips }
    );
  res.render('payment-confirm', {});
  
  } else {
    res.redirect('/')
  }



  
});

/* LAST TRIPS */
router.get('/last-trips', async function(req, res, next) {
  if (req.session.user_logged === true) {
    console.log(req.query.data)
  
    var fake_id = "61f27f8b864b0c0b1e5c73bf"
    var user_data = await userModel.findById(fake_id)
    var last_trips = user_data.trips
    console.log(last_trips)
  
    res.render('last-trips', {last_trips:last_trips});
    
  } else {
    res.redirect('/')
  }
  
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
