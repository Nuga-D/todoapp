
const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Timidade01.",
  database: "todoapp",
};

const pool = mysql.createPool(dbConfig);

const Todo = {
  async createTodo(title, description, completed, user_id) {
    const [result] = await pool.execute(
      "INSERT INTO todos (created_at, updated_at, title, description, completed, user_id) VALUES (NOW(), NOW(), ?, ?, ?, ?)",
      [title, description, completed, user_id]
    );
    const todoId = result.insertId;
    const todo = await pool.execute('SELECT * FROM todos WHERE id = ?', [todoId]);
    return todo[0];
  },

  async findTodosByUserId(user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM todos WHERE user_id = ?',
      [user_id]
    );
    return rows;
  },

  async getTodoItemById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async updateTodoItem(id, title, description, completed) {
    const [result] = await pool.execute(
      'UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ?',
      [title, description, completed, id]
    );
    return result.affectedRows > 0;
  },

  async deleteTodoItem(id) {
    const [result] = await pool.execute(
      'DELETE FROM todos WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

};


module.exports = Todo;
