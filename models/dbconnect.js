var mongoose = require("mongoose")

const dotenv = require('dotenv');
dotenv.config();



//console.log(process.env.DB_LOGIN)
//console.log(process.env.DB_PASSWORD)
//console.log(process.env.DB_NAME)

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
   };
  
  // --------------------- BDD -----------------------------------------------------
  mongoose.connect('mongodb+srv://'+process.env.DB_LOGIN+':'+process.env.DB_PASSWORD+'@cluster0.wp3my.mongodb.net/'+process.env.DB_NAME+'?retryWrites=true&w=majority',
     options,
     function(err) {
      if (err) {
        console.log(`error, failed to connect to the database because --> ${err}`);
      } else {
        console.info('*** Database Ticketac connection : Success ***');
      }
     }
  );