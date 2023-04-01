const express = require('express');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo')
const taskRoutes = require('./routes/task')


const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/login', authRoutes);
app.use('/logout', authRoutes);
app.use('/', authRoutes);
app.use('/todo', todoRoutes);
app.use('/task', todoRoutes);
app.use('/todos', todoRoutes);
app.use('/:id', todoRoutes);
app.use('/task', taskRoutes);
app.use('/task/todos/:todoId', taskRoutes);
app.use('/tasks/:taskId', taskRoutes);


// Start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
