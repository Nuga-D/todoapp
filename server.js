const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const authRoutes = require('./routes/auth');


const app = express();
const port = 3000;
const sessionStore = new MySQLStore({
  host: 'localhost',
  user: 'user',
  password: 'root',
  database: 'todoapp',
  port: 3306
});

// Set up middleware
app.use(session({
  secret: 'root',
  resave: false,
  saveUninitialized: false
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use('/signup', authRoutes);
app.use('/login', authRoutes);
app.use('/logout', authRoutes);
app.use('/', authRoutes);
// Set up database connection
const dbConfig = {
  host: 'localhost',
  user: 'user',
  password: 'root',
  database: 'todoapp'
};

// Start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.getUserById(id);
  done(null, user);
});

// Define local strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await User.getUserByUsername(username);

  if (!user) {
    return done(null, false, { message: 'Incorrect username or password' });
  }

  
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(password);
  console.log(user.password);
  console.log(bcrypt.compare(password,user.password));

  if (!isMatch) {
    return done(null, false, { message: 'Incorrect username or password' });
  }

  return done(null, user);
}));