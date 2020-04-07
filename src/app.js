const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {


  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body

  if (!title && !url && !techs)
    return response.status(400).json({ Message: 'Dados Incorretos' })

  const newRepository = {
    id: uuid(),
    title,
    techs,
    url,
    likes: 0
  }

  repositories.push(newRepository)
  response.status(201).json(newRepository)

});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params
  const { techs, url, title } = request.body

  const findIndexRepository = repositories.findIndex(repo => repo.id === id)
  if (findIndexRepository < 0)
    return response.status(400).send('Usúario Não encontrado.')

  const oldRepository = repositories[findIndexRepository]

  repositories[findIndexRepository] = {
    id,
    techs,
    url,
    title,
    likes: oldRepository.likes
  }

  response.status(200).send(repositories[findIndexRepository])

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const findIndexRepository = repositories.findIndex(repo => repo.id === id)
  console.log(findIndexRepository)
  if (findIndexRepository === -1)
    return response.status(400).send()

  repositories.splice(findIndexRepository, 1)
  response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  if (!id) return response.status(400).json({ message: 'Usuário não encontrado' })
  const findIndexRepository = repositories.findIndex(repo => repo.id === id)

  if (findIndexRepository < 0)
    return response.status(400).json({ message: 'Usuário não encontrado' })

  repositories[findIndexRepository].likes += 1

  return response.status(200).json(repositories[findIndexRepository])

});

module.exports = app;
