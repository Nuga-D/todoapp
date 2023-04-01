const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "todoapp",
};

const pool = mysql.createPool(dbConfig);

const Task = {
  async createTask(todoId, title, description, completed) {
    const [result] = await pool.execute(
      "INSERT INTO task (todo_id, title, description, completed) VALUES (?, ?, ?, ?)",
      [todoId, title, description, completed]
    );
    const [task] = await pool.execute("SELECT * FROM task WHERE id = ?", [
      result.insertId,
    ]);
    return task;
  },

  async findTasksByTodoId(todoId) {
    const [tasks] = await pool.execute("SELECT * FROM task WHERE todo_id = ?", [
      todoId,
    ]);
    return tasks;
  },

  async findTaskById(id) {
    const [rows] = await pool.execute("SELECT * FROM task WHERE id = ?", [id]);
    if (rows.length === 0) {
      return null;
    }
    const row = rows[0];
    return row;
  },

  async update(title, description, completed, id) {
    await pool.execute(
      "UPDATE task SET title = ?, description = ?, completed = ? WHERE id = ?",
      [title, description, completed, id]
    );
  },

  async deleteTask(id) {
    await pool.execute(
      'DELETE FROM task WHERE id = ?',
      [id]
    );}
};

module.exports = Task;
