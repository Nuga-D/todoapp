
const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "todoapp",
};

const pool = mysql.createPool(dbConfig);

const Todo = {
  async createTodo(title, description, completed, createdAt, updatedAt, user_id) {
    const [result] = await pool.execute(
      "INSERT INTO todos (title, description, completed, created_at, updated_at, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, completed, createdAt, updatedAt, user_id]
    );
    return result.todo;
  },

  async findTodosByUserId(user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM todos WHERE user_id = ?',
      [user_id]
    );
    return rows[0];
  }
};

module.exports = Todo;
