const express = require("express");
const jwt = require("jsonwebtoken");
const Todo = require('../models/todos');

const router = express.Router();


//get a todo list
router.get("/todos", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, "root");
    const userId = decodedToken.userId;

    const todos = await Todo.findTodosByUserId(userId);
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occured");
  }
});


//post a todo list
router.post("/todos", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, "root");
    const userId = decodedToken.userId;

    const { title, description, completed, createdAt, updatedAt } = req.body;
    const todo = await Todo.createTodo(
      title,
      description,
      completed,
      createdAt,
      updatedAt,
      userId
    );
    res.json(todo);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occured");
  }
});


  // Endpoint for creating a task
router.post('/task', async (req, res) => {
  try {
    // Verify the JSON Web Token
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, 'your_secret_key');
    const userId = decodedToken.userId;

    // Find the to-do list by ID and user ID
    const todoListId = req.body.todo_list_id;
    pool.query('SELECT * FROM todo_items WHERE id = ? AND user_id = ?', [todoListId, userId], (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
        res.status(401).send('Unauthorized');
        return;
      }

      // Insert the task into the database
      const task = {
        name: req.body.name,
        todo_list_id: todoListId,
      };
      pool.query('INSERT INTO tasks SET ?', task, (error, results) => {
        if (error) throw error;
        res.send('Task created successfully');
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;
