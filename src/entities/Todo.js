const { Entity, Column, PrimaryGeneratedColumn, ManyToOne } = require('typeorm');
const User = require('./User');

@Entity()
class Todo {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  title;

  @Column({ default: false })
  completed;

  @ManyToOne(() => User, user => user.todos)
  user;
}

module.exports = Todo;
