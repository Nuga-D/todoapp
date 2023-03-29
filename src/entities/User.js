const { Entity, Column, PrimaryGeneratedColumn, OneToMany } = require('typeorm');
const Todo = require('./Todo');

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id;

  @Column({ unique: true })
  email;

  @Column()
  password;

  @OneToMany(() => Todo, todo => todo.user)
  todos;
}

module.exports = User;
