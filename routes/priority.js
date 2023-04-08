const express = require('express');
const router = express.Router();
const Priority = require('../models/priority');


// Get all priorities
router.get('/get/Priority', async (req, res) => {
    try {
      const priority = await Priority.getAll();
      res.json({priority});
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });
  
  // Create a new Priority
  router.post('/createPriority', async (req, res) => {
    try {
      const { name, color } = req.body;
      const priority = await Priority.create(name, color);
      res.json({priority});
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });
  
  // Get a Priority by ID
  router.get('/getPriority/:priorityId', async (req, res) => {
    try {
      const priorityId = req.params.priorityId;
      const priority = await Priority.getById(priorityId);
      res.json({priority});
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });
  
  // Update a Priority by ID
  router.put('/updatePriority/:priorityId', async (req, res) => {
    try {
      const priorityId = req.params.priorityId;
      const { name, color } = req.body;
      const priority = await Priority.update(name, color, priorityId);
      res.send(`priority ${priorityId} updated successfully`);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });
  
  // Delete a priority by ID
  router.delete('/deletePriority/:priorityId', async (req, res) => {
    try {
      const priorityId = req.params.priorityId;
      await Priority.delete(priorityId);
      res.send('Priority successfully deleted');
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });

module.exports = router;
