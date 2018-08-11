const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session')
const path = require('path');
const app = express();
const passport = require('passport');

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Load Passport config
require('./config/passport')(passport);

// Load DB Config
const db = require('./config/database');

// Connect to mongo
mongoose.connect(db.mongoURI, {
        useNewUrlParser: true
    })
    .then(() => console.log("Mongo DB connected..."))
    .catch(err => console.log(`Mongo DB connection error -> ${err.message}`));

// Handlebars template engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Add index route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

// Add about Route
app.get('/about', (req, res) => {
    res.render('about');
});

//ideas and users pages
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server started on port ${port}`)
});