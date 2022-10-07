const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [
  {
    id: uuidv4(),
    name: "Elcio Sato",
    username: "elcio",
    todos: [
      {
        id: uuidv4(),
        title: "Desafio 01 - Ignite NodeJS",
        done: false,
        deadline: '2022-10-27T00:00:00.000Z',
        created_at: '2022-10-07T00:00:00.000Z'
      },
      {
        id: "e9eef8f3-8c2d-451d-a4c1-69f297e336d1",
        title: "Estudar JavaScript",
        done: false,
        deadline: '2022-10-27T00:00:00.000Z',
        created_at: '2022-10-07T00:00:00.000Z'
      },
    ]
  }
];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find(usr => usr.username === username);
  if (user) {
    request.user = user;
    next();
  } else {
    return response.status(404).json({ error: "Username not found!" })
  }
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const isUserExists = users.some(usr => usr.username === username);
  if (isUserExists) {
    return response.status(400).json({ error: "Username already exists!" })
  }
  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(newUser);
  return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = request.user;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = request.user;
  const { title, deadline } = request.body;
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(todo);
  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = request.user;
  const { id: todoId } = request.params;
  const { title, deadline } = request.body;
  const todo = user.todos.find(t => t.id === todoId);
  if (todo) {
    todo.title = title;
    todo.deadline = new Date(deadline);
    return response.json(todo);
  } else {
    return response.status(404).json({ error: "Todo Id not found!" })
  }
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = request.user;
  const { id: todoId } = request.params;
  const todo = user.todos.find(t => t.id === todoId);
  if (todo) {
    todo.done = true;
    return response.json(todo);
  } else {
    return response.status(404).json({ error: "Todo Id not found!" })
  }
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = request.user;
  const { id: todoId } = request.params;
  const todo = user.todos.find(t => t.id === todoId);
  if (todo) {
    user.todos.splice(todo, 1);
    return response.status(204).send();
  } else {
    return response.status(404).json({ error: "Todo Id not found!" })
  }
});

module.exports = app;