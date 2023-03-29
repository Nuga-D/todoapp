const express = require('express');
const { getRepository } = require('typeorm');
const TodoRepository = require('../repositories/TodoRepository');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/todos', authMiddleware, async (req, res) => {
  const todoRepository = getRepository(TodoRepository);
  const todos = await todoRepository.findTodosByUserId(req.user.id);
  res.json(todos);
});

router.post('/todos', authMiddleware, async (req, res) => {
  const { title } = req.body;
  const todoRepository = getRepository(TodoRepository);
  const todo = await todoRepository.createTodo(req.user.id, title);
  res.json(todo);
});

module.exports = router;