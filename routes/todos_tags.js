// routes/todos_tags.js
const express = require('express');
const router = express.Router();
const TodoTag = require('../models/todo_tags');

// Create a new todo tag
router.post('/todoTags', async (req, res) => {
  try {
    const { todo_id, tag_id } = req.body;
    const todoTag = await TodoTag.create(todo_id, tag_id);
    res.json({todoTag});
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

// Get all todo tags by tag_id
router.get('/tags/:tagId', async (req, res) => {
  try {
    const tagId = req.params.tagId;
    const todoTags = await TodoTag.findByTagId(tagId);
    res.json({todoTags});
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

// Delete a todo tag
router.delete('/todoTags/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await TodoTag.delete(id);
    res.send('todoTag successfully deleted');
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;
