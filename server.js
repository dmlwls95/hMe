// server.js

let express = require('express'),
bodyParser = require('body-parser'),
cors = require('cors'),
cookieParser = require('cookie-parser'),
mongoose = require('mongoose'),
db = require('./DB.js'),
passport = require('passport');
const app = express();

// Create link to Angular build directory
var distDir = __dirname + "/dist/sb-admin-angular";
app.use(express.static(distDir));

db();
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials",true);
    next();
  });
  

const hMeRoutes = require('./routes/hme.route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

app.use(passport.initialize());
//app.use(passport.session());
//app.use(passport.authenticate('session'));
app.use(cookieParser('abcedf'));
app.enable('trust proxy');
/*app.use(session({
    secret: 'abcedf',
    resave: true,
    saveUninitialized: false
}));*/
require('./config/passport')(passport);
const port = process.env.PORT || 4000;

app.use('/hme', hMeRoutes);

const server = app.listen(port, function(){
    console.log('Listening on port ' + port);
});