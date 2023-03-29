require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { createConnection } = require('typeorm');
const User = require('./src/entities/User');
const Todo = require('./src/entities/Todo');
const authRoutes = require('./src/routes/authRoutes');
const todoRoutes = require('./src/routes/todoRoutes');

const app = express();

app.use(bodyParser.json());

createConnection({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Todo],
  synchronize: true,
}).then(() => {
  app.use('/api/auth', authRoutes);
  app.use('/api/todos', todoRoutes);

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)})});