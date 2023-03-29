const { EntityRepository } = require('typeorm');
const Todo = require('../entities/Todo');

class TodoRepository extends EntityRepository {
  async createTodo(userId, title) {
    const todo = new Todo();
    todo.title = title;
    todo.user = { id: userId };
    await this.save(todo);
    return todo;
  }

  async findTodosByUserId(userId) {
    return this.find({ where: { user: { id: userId } } });
  }
}

module.exports = TodoRepository;
