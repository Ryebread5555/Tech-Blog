const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');

// helper functions
const helpers = require('./utils/helpers')

// handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({helpers});

// connect session to sequelize
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3001;

const SequelizeStore = require('connect-session-sequelize')(session.Store);

// create session
const sess = {
    secret: 'Super secret secret',
    cookie: {
        maxAge: 50000000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// handlbars as default template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Set up a middleware to pass the "logged in" status to all views
app.use((req, res, next) => {
  res.locals.loggedIn = req.session.logged_in;
  next();
});

// Set up routes
app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});
