const express = require('express');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo');
const taskRoutes = require('./routes/task');
const tagRoutes = require('./routes/tag');
const todotagsRoutes = require('./routes/todos_tags');
const priorityRoutes = require('./routes/priority');


const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/login', authRoutes);
app.use('/logout', authRoutes);
app.use('/', authRoutes);
app.use('/todo', todoRoutes);
app.use('/todos', todoRoutes);
app.use('/:id', todoRoutes);
app.use('/:todoId/tags', todoRoutes);
app.use('/:todoId/tags/:tagId', todoRoutes);
app.use('/task', taskRoutes);
app.use('/task/todos/:todoId', taskRoutes);
app.use('/tasks/:taskId', taskRoutes);
app.use('/tasks/:taskId/order', taskRoutes);
app.use('/tasks/reorder/:todoId', taskRoutes);
app.use('/tasks/:taskId/setPriority/:priorityId', taskRoutes);
app.use('/tasks/:taskId/deadline', taskRoutes);
app.use('/tasks/:taskId/file', taskRoutes);
app.use('/tag', tagRoutes);
app.use('/', tagRoutes);
app.use('/:tagId', tagRoutes);
app.use('/delete/:tagId', tagRoutes);
app.use('/update/:tagId', tagRoutes);
app.use('/todos_tags', todotagsRoutes);
app.use('/todoTags', todotagsRoutes);
app.use('/tags/:tagId', todotagsRoutes);
app.use('/todoTags/:id', todotagsRoutes);
app.use('/priority', priorityRoutes);
app.use('/deletePriority/:priorityId', priorityRoutes);
app.use('/updatePriority/:priorityId', priorityRoutes);
app.use('/getPriority/:priorityId', priorityRoutes);
app.use('/createPriority', priorityRoutes);
app.use('/get/Priority', priorityRoutes);


// Start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
