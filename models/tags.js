const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "todoapp",
};

const pool = mysql.createPool(dbConfig);

const Tag = {
    
    async create(name) {
        const query = 'INSERT INTO tags (name) VALUES (?)';
        const [result] = await pool.execute(query, [name]);
        const [tag] = await pool.execute("SELECT * FROM tags WHERE id = ?", [result.insertId,]);
        return tag;
      },
    
    async getById(id) {
        const query = 'SELECT * FROM tags WHERE id = ?';
        const [tag] = await pool.execute(query, [id]);
        return tag;
      },

      async getByName(name) {
        const query = 'SELECT id FROM tags WHERE name = ?';
        const [tag] = await pool.execute(query, [name]);
        const tagId = parseInt(tag[0].id);
        return tagId;
      }, 
    
    async getAll() {
        const query = 'SELECT * FROM tags';
        const [result] = await pool.execute(query);
        return result;
      },
    
    async update(name, id) {
        const query = 'UPDATE tags SET name = ? WHERE id = ?';
        const tag = await pool.execute(query, [name, id]);
        return tag[0];
      },
    
    async delete(id) {
        const query = 'DELETE FROM tags WHERE id = ?';
        await pool.execute(query, [id]);
      }
}

module.exports = Tag;