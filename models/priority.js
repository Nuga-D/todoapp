const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "todoapp",
};

const pool = mysql.createPool(dbConfig);

const Priority = {
    
    async create(name, color) {
        const query = 'INSERT INTO priority (name, color) VALUES (?, ?)';
        const [result] = await pool.execute(query, [name, color]);
        const [priority] = await pool.execute("SELECT * FROM priority WHERE id = ?", [result.insertId,]);
        return priority;
      },
    
    async getById(id) {
        const query = 'SELECT * FROM priority WHERE id = ?';
        const [priority] = await pool.execute(query, [id]);
        return priority;
      },

      async getByName(name) {
        const query = 'SELECT id FROM priority WHERE name = ?';
        const [priority] = await pool.execute(query, [name]);
        const priorityId = parseInt(priority[0].id);
        return priorityId;
      }, 
    
    async getAll() {
        const query = 'SELECT * FROM priority';
        const [result] = await pool.execute(query);
        return result;
      },
    
    async update(name, color, id) {
        const query = 'UPDATE priority SET name = ?, color = ? WHERE id = ?';
        const priority = await pool.execute(query, [name, color, id]);
        return priority[0];
      },
    
    async delete(id) {
        const query = 'DELETE FROM priority WHERE id = ?';
        await pool.execute(query, [id]);
      }
}

module.exports = Priority;