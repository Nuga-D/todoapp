const { createConnection } = require('typeorm');
const User = require('../entities/User');
const Todo = require('../entities/Todo');

const connection = createConnection({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Todo],
  synchronize: true,
});

module.exports = connection;

