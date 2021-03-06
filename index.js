const express = require('express');
const chalk = require('chalk');
const mongoose = require("mongoose");
const morgan= require("morgan"); //HTTP logger
const path=require('path');
const user = require("./routes/user");    //user
const passport=require("passport"); //importing passport
const bodyParser=require("body-parser");
// --------------------Routes-----------------------
const routes=require('./routes/api');

//dotenv configuration
require("dotenv").config();



const app = express();
//! STEP 1
const PORT=process.env.PORT || 5000

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());

// data parsing
app.use(express.json());
app.use(express.urlencoded({extended:false}));


//---------Middleware--------------
app.use(express.static('public'));
app.use(passport.initialize());

// HTTP request logger
app.use(morgan('tiny'));

//passport config
require("./config/passport")(passport);




// Creating database connection
//? for ref to run mongoDB on local machine => "mongodb://localhost:27017/onlyMealDB"  
//! STEP 2
mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,   //(node:63208) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead [duplicate]

}, (err) => {
    if (err) {
        console.log(chalk.red(err));
    } else {
        console.log(chalk.yellow("Connected to database"));
    }
})

app.use("/api",routes);
//routes
//STUPID MISTAKE : its "/user" not "./user"
app.use("/user",user);

//! STEP 3
//? run "npm run build" to make build folder in client
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    app.get('*', (request, response) => {
        response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

//! STEP 4
//? go inside package.son of server then paste the following inside script
//? "build": "cd client && npm run build",
//? "install-client": "cd client && npm install",
//? "heroku-postbuild": "npm run install-client && npm run build",
//------------Server Site---------------    
app.listen(PORT, () => {
    console.log(chalk.green("Server running on port ",PORT));
});
