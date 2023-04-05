const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Timidade01.",
  database: "todoapp",
};

const pool = mysql.createPool(dbConfig);


const TodoTag = {
async create(todo_id, tag_id) {
    const [result] = await pool.execute(
      'INSERT INTO todos_tags (todo_id, tag_id) VALUES (?, ?)',
      [todo_id, tag_id]
    );
    const [todoTag] = await pool.execute("SELECT * FROM todos_tags WHERE id = ?", [result.insertId])
    return todoTag;
  },

  async addTag(todoId, tagId) {
    try {
      await pool.query('INSERT INTO todos_tags (todo_id, tag_id) VALUES (?, ?)', [todoId, tagId]);
    } catch (error) {
      throw new Error(`Could not add tag to todo: ${error.message}`);
    }
  },

  async findByTodoId(todo_id) {
    const [result] = await pool.query(
      'SELECT t.*, tg.id AS todo_tag_id FROM tags t JOIN todos_tags tg ON tg.tag_id = t.id WHERE tg.todo_id = ?',
      [todo_id]
    );
    return result;
  }
  ,

  async findByTagId(tag_id) {
    const [result] = await pool.query(
      'SELECT * FROM todos_tags WHERE tag_id = ?',
      [tag_id]
    );
    return result;
  },

  async delete(id) {
    await pool.query('DELETE FROM todos_tags WHERE id = ?', [id]);
  },

  async deleteById(tagid, todoid) {
    await pool.query('DELETE FROM todos_tags WHERE tag_id = ? AND todo_id = ?', [tagid, todoid]);
  }

}

module.exports = TodoTag;