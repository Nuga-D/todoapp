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

    const { title, description, completed} = req.body;
    const todo = await Todo.createTodo(
      title,
      description,
      completed,
      userId
    );
    res.json(todo);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occured");
  }
});

// Update a todo item
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.getTodoItemById(req.params.id);
    if (!todo) {
      return res.status(404).send('Todo item not found');
    }

    // Only allow updating if the user is the owner of the todo item
    const decodedToken = jwt.verify(req.headers.authorization.split(' ')[1], 'root');
    if (decodedToken.userId !== todo.user_id) {
      return res.status(403).send('Forbidden');
    }

    await Todo.updateTodoItem(req.params.id, req.body.title, req.body.description, req.body.completed);
    res.send('Todo item updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// Delete a todo item
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.getTodoItemById(req.params.id);
    if (!todo) {
      return res.status(404).send('Todo item not found');
    }

    // Only allow deleting if the user is the owner of the todo item
    const decodedToken = jwt.verify(req.headers.authorization.split(' ')[1], 'root');
    if (decodedToken.userId !== todo.user_id) {
      return res.status(403).send('Forbidden');
    }

    await Todo.deleteTodoItem(req.params.id);
    res.send('Todo item deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});



module.exports = router;
