import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { getISTLocalizedTime } from '../utils/utils.js'

const dbPath = path.join('__dirname', 'db.json')

function readTask() {
  return new Promise((resolve, reject) => {
    fs.readFile(dbPath, 'utf-8', (err, data) => {
      if (err) {
        return reject(err)
      } else {
        try {
          const db = JSON.parse(data)
          resolve(db.todos || [])
        } catch (e) {
          reject(e)
        }
      }
    })
  })
}

function writeTask(tasks) {
  return new Promise((resolve, reject) => {
    const db = { todos: tasks }
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return reject(err)
      } else {
        try {
          resolve()
        } catch (e) {
          reject(e)
        }
      }
    })
  })
}

export async function getTasks(req, res, next) {
  try {
    const todos = await readTask()
    res.json(todos)
  } catch (e) {
    next(e)
  }
}

export async function addTask(req, res, next) {
  try {
    const { title, tags = [], isImpotant } = req.body

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      const error = new Error('Invalid title (min 3 characters)')
      error.status = 400
      return next(error)
    }
    const todos = await readTask()
    const newId = randomUUID()
    const newTodoWithId = {
      id: newId,
      title: title.trim(),
      tags: Array.isArray(tags) ? tags : [],
      isImpotant: isImpotant.trim(),
      isCompleted: false,
      createdAt: getISTLocalizedTime(),
      updatedAt: getISTLocalizedTime(),
    }
    todos.push(newTodoWithId)
    await writeTask(todos)
    res.status(201).json(newTodoWithId)
  } catch (e) {
    next(e)
  }
}

export async function deleteTask(req, res, next) {
  try {
    const todos = await readTask()
    const deleteTodoId = parseInt(req.params.id)
    const index = todos.findIndex((todo) => todo.id === deleteTodoId)
    if (index === -1) {
      return res.status(404).json({ message: 'Todo not found' })
    } else {
      res.json(todos[index])
      todos.splice(index, 1)
      await writeTask(todos)
      res.status(201).json({ message: 'todo deleted successfully' })
    }
  } catch (e) {
    next(e)
  }
}

export async function updateTask(req, res, next) {
  try {
    const todos = await readTask()
    const updateTodoId = parseInt(req.params.id)
    const index = todos.findIndex((todo) => todo.id === updateTodoId)
    if (index === -1) {
      return res.status(404).json({ message: 'Todo not found' })
    } else {
      todos[index] = { ...todos[index], ...req.body }
      await writeTask(todos)
      res.status(201).json(todos[index])
    }
  } catch (e) {
    next(e)
  }
}
