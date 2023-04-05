const express = require('express');
const router = express.Router();
const Tag = require('../models/tags');


// Get all tags
router.get('/', async (req, res) => {
    try {
      const tags = await Tag.getAll();
      res.json({tags});
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });
  
  // Create a new tag
  router.post('/', async (req, res) => {
    try {
      const { name } = req.body;
      const tag = await Tag.create(name);
      res.json({tag});
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });
  
  // Get a tag by ID
  router.get('/:tagId', async (req, res) => {
    try {
      const tagId = req.params.tagId;
      const tag = await Tag.getById(tagId);
      res.json({tag});
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });
  
  // Update a tag by ID
  router.put('/update/:tagId', async (req, res) => {
    try {
      const tagId = req.params.tagId;
      const { name } = req.body;
      const tag = await Tag.update(name, tagId);
      res.send(`tag ${tagId} updated successfully`);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });
  
  // Delete a tag by ID
  router.delete('/delete/:tagId', async (req, res) => {
    try {
      const tagId = req.params.tagId;
      await Tag.delete(tagId);
      res.send('tag successfully deleted');
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });

module.exports = router;
