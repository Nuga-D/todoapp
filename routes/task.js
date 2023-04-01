const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');
const Todo = require('../models/todos');

const taskRouter = express.Router();

taskRouter.get('/todos/:todoId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, 'root');
    const userId = decodedToken.userId;

    const todoId = req.params.todoId;
    const tasks = await Task.findTasksByTodoId(todoId);

    // Verify that the user owns the specified todo
    const todos = await Todo.findTodosByUserId(userId);
    const todoIds = todos.map(todo => todo.id);
    if (!todoIds.includes(parseInt(todoId))) {
      return res.status(401).send('Unauthorized');
    }

    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

taskRouter.post('/todos/:todoId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, 'root');
    const userId = decodedToken.userId;

    const todoId = req.params.todoId;
    const { title, description, completed } = req.body;

    // Verify that the user owns the specified todo
    const todos = await Todo.findTodosByUserId(userId);
    const todoIds = todos.map(todo => todo.id);
    if (!todoIds.includes(parseInt(todoId))) {
      return res.status(401).send('Unauthorized');
    }

    const task = await Task.createTask(todoId, title, description, completed);
    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});


// Update a task
taskRouter.put("/tasks/:taskId", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, 'root');
    const userId = decodedToken.userId;
    const taskId = req.params.taskId;

    const task = await Task.findTaskById(taskId);

    const todoId = task.todo_id;

    // Verify that the user owns the specified todo
    const todos = await Todo.findTodosByUserId(userId);
    const todoIds = todos.map(todo => todo.id);
    if (!todoIds.includes(parseInt(todoId))) {
      return res.status(401).send('Unauthorized');
    }

    
    const { title, description, completed } = req.body;
    const updatedTask = await Task.update(title, description, completed, taskId);
    res.json(updatedTask);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});

// Delete a task
taskRouter.delete("/tasks/:taskId", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, 'root');
    const userId = decodedToken.userId;
    const taskId = req.params.taskId;

    const task = await Task.findTaskById(taskId);

    const todoId = task.todo_id;

    // Verify that the user owns the specified todo
    const todos = await Todo.findTodosByUserId(userId);
    const todoIds = todos.map(todo => todo.id);
    if (!todoIds.includes(parseInt(todoId))) {
      return res.status(401).send('Unauthorized');
    }

    await Task.deleteTask(taskId);
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});


module.exports = taskRouter;
