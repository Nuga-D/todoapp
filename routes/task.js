const express = require('express');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/multer');
const Task = require('../models/task');
const Todo = require('../models/todos');

const taskRouter = express.Router();


//get all tasks
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

    res.json({tasks});
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

//get task by id

taskRouter.get('/tasks/:taskId', async (req, res) => {
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

    res.json({task});
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

//create task
taskRouter.post('/todos/:todoId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, 'root');
    const userId = decodedToken.userId;

    const todoId = req.params.todoId;
    const { title, description, completed, order, priority_id, deadline } = req.body;

    // Verify that the user owns the specified todo
    const todos = await Todo.findTodosByUserId(userId);
    const todoIds = todos.map(todo => todo.id);
    if (!todoIds.includes(parseInt(todoId))) {
      return res.status(401).send('Unauthorized');
    }

    const task = await Task.createTask(todoId, title, description, completed, order, priority_id, deadline);
    res.json({task});
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

    
    const { title, description, completed, order, priority_id, deadline } = req.body;
    const updatedTask = await Task.update(title, description, completed, order, priority_id, deadline, taskId);
    res.json({updatedTask});
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});

//update a task order

taskRouter.patch('/tasks/:taskId/order', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, 'root');
    const userId = decodedToken.userId;
    const taskId = req.params.taskId;
    const { order } = req.body;

    const task = await Task.findTaskById(taskId);

    const todoId = task.todo_id;

    // Verify that the user owns the specified todo
    const todos = await Todo.findTodosByUserId(userId);
    const todoIds = todos.map(todo => todo.id);
    if (!todoIds.includes(parseInt(todoId))) {
      return res.status(401).send('Unauthorized');
    }
    
    const updatedTask = await Task.reorder(order, taskId);
    res.json({updatedTask});
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

// Update all tasks order
taskRouter.patch('/tasks/reorder/:todoId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, 'root');
    const userId = decodedToken.userId;
    const todoId = req.params.todoId;
    const tasks = req.body.tasks;

    // Validate that the tasks array contains valid order values
    const orderValues = tasks.map(task => task.order);
    const isValidOrder = orderValues.every(value => Number.isInteger(value));
    if (!isValidOrder) {
      return res.status(400).send('Invalid task order values');
    }

    // Verify that the user owns the specified todo
    const todos = await Todo.findTodosByUserId(userId);
    const todoIds = todos.map(todo => todo.id);
    if (!todoIds.includes(parseInt(todoId))) {
      return res.status(401).send('Unauthorized');
    }

    // Update the order of each task in the database
    const promises = tasks.map(task => Task.updateTaskOrder(task.id, task.order));
    await Promise.all(promises);

    // Retrieve the updated tasks and return them in the response
    const updatedTasks = await Task.findTasksByTodoId(todoId);
    res.json({updatedTasks});
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

//set priority
taskRouter.patch('/tasks/:taskId/deadline', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, 'root');
    const userId = decodedToken.userId;
    const taskId = req.params.taskId;
    const { deadline } = req.body;
    

    const task = await Task.findTaskById(taskId);

    const todoId = task.todo_id;

    // Verify that the user owns the specified todo
    const todos = await Todo.findTodosByUserId(userId);
    const todoIds = todos.map(todo => todo.id);
    if (!todoIds.includes(parseInt(todoId))) {
      return res.status(401).send('Unauthorized');
    }
    
    const updatedTask = await Task.setDeadline(deadline, taskId);
    res.json({updatedTask});
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

//set deadline
taskRouter.patch('/tasks/:taskId/setPriority/:priorityId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, 'root');
    const userId = decodedToken.userId;
    const taskId = req.params.taskId;
    const priorityId = req.params.priorityId;
    

    const task = await Task.findTaskById(taskId);

    const todoId = task.todo_id;

    // Verify that the user owns the specified todo
    const todos = await Todo.findTodosByUserId(userId);
    const todoIds = todos.map(todo => todo.id);
    if (!todoIds.includes(parseInt(todoId))) {
      return res.status(401).send('Unauthorized');
    }
    
    const updatedTask = await Task.setPriority(priorityId, taskId);
    res.json({updatedTask});
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

//upload files
taskRouter.patch('/tasks/:taskId/file', upload, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, 'root');
    const userId = decodedToken.userId;
    const taskId = req.params.taskId;
    const files = req.files;  // get the uploaded file details
    

    const task = await Task.findTaskById(taskId);

    const todoId = task.todo_id;

    // Verify that the user owns the specified todo
    const todos = await Todo.findTodosByUserId(userId);
    const todoIds = todos.map(todo => todo.id);
    if (!todoIds.includes(parseInt(todoId))) {
      return res.status(401).send('Unauthorized');
    }
    
    const updatedTask = await Task.addFile(files.map(file => file.filename), taskId);
    res.json(updatedTask);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
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
    res.sendStatus(204).send('task deleted successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});


module.exports = taskRouter;
