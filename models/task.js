const pool = require("../db/pool");

const Task = {
  async createTask(todoId, title, description, completed, order, priority_id, deadline) {
    const [result] = await pool.execute(
      "INSERT INTO task (todo_id, title, description, completed, `order`, priority_id, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [todoId, title, description, completed, order, priority_id, deadline]
    );
    const [task] = await pool.execute("SELECT * FROM task WHERE id = ?", [
      result.insertId,
    ]);
    return task;
  },

  async findTasksByTodoId(todoId) {
    const [tasks] = await pool.execute("SELECT * FROM task WHERE todo_id = ? ORDER BY `order`", [
      todoId,
    ]);
    return tasks;
  },

  async findTaskById(id) {
    const [rows] = await pool.execute("SELECT * FROM task WHERE id = ? ORDER BY `order`", [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  },

  async update(title, description, completed, order, priority_id, deadline, id) {
    await pool.execute(
      "UPDATE task SET title = ?, description = ?, completed = ?, `order` = ?, priority_id = ?, deadline = ? WHERE id = ?",
      [title, description, completed, order, priority_id, deadline, id]
    );
    const [rows] = await pool.execute("SELECT * FROM task WHERE id = ?", [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  },

  async updateTaskOrder(taskId, newOrder) {
    const query = 'UPDATE task SET `order` = ? WHERE id = ?';
    await pool.execute(query, [newOrder, taskId]);
  },

  async reorder(order, id) {
    await pool.execute(
      "UPDATE task SET `order` = ? WHERE id = ?",
      [order, id]
    );
    const [rows] = await pool.execute("SELECT * FROM task WHERE id = ?", [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  },

  async setPriority(priority_id, id) {
    await pool.execute(
      "UPDATE task SET priority_id = ? WHERE id = ?",
      [priority_id, id]
    );
    const [rows] = await pool.execute("SELECT * FROM task WHERE id = ?", [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  },

  async setDeadline(deadline, id) {
    await pool.execute(
      "UPDATE task SET deadline = ? WHERE id = ?",
      [deadline, id]
    );
    const [rows] = await pool.execute("SELECT * FROM task WHERE id = ?", [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  },

  async addFile(file, id) {
    await pool.execute(
      "UPDATE task SET file = ? WHERE id = ?",
      [file, id]
    );
    const [rows] = await pool.execute("SELECT * FROM task WHERE id = ?", [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  },


  async deleteTask(id) {
    await pool.execute(
      'DELETE FROM task WHERE id = ?',
      [id]
    );}
};

module.exports = Task;
