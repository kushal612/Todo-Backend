// import fs from 'fs'
// import path from 'path'
// //import { randomUUID } from 'crypto'
// //import { getISTLocalizedTime } from '../utils/utils.js'
import { taskCreateSchema } from '../schema/schema.js'
import { validateRequest } from '../validation/validator.js'
import Task from '../model/taskModel.js'

export async function postDocument(req, res, next) {
  const validatedData = await validateRequest(taskCreateSchema, req.body, next)
  if (!validatedData) return

  try {
    const newTodo = await Task.create(validatedData)
    newTodo.save()
    console.log('New Todo Added:', newTodo.title)
    res.status(201).json({
      message: 'Todo added successfully',
      todo: newTodo,
    })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        error: err.message,
      })
    }
    next(err)
  }
}

export async function getDocument(req, res, next) {
  try {
    const allTask = await Task.find({})
    res.send(allTask)
  } catch (err) {
    next(err)
  }
}

export async function getDocumentById(req, res, next) {
  try {
    const id = req.params.id
    console.log(id)

    const task = await Task.findById(id)
    if (!task) {
      const error = new Error(`Todo with id ${id} not found`)
      error.statusCode = 404
      throw error
    }
    res.status(200).json(task)
  } catch (err) {
    next(err)
  }
}

// const dbPath = path.join('__dirname', 'db.json')

// function readTask() {
//   return new Promise((resolve, reject) => {
//     fs.readFile(dbPath, 'utf-8', (err, data) => {
//       if (err) {
//         return reject(err)
//       } else {
//         try {
//           const db = JSON.parse(data)
//           resolve(db.todos || [])
//         } catch (e) {
//           reject(e)
//         }
//       }
//     })
//   })
// }

// function writeTask(tasks) {
//   return new Promise((resolve, reject) => {
//     const db = { todos: tasks }
//     fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
//       if (err) {
//         return reject(err)
//       } else {
//         try {
//           resolve()
//         } catch (e) {
//           reject(e)
//         }
//       }
//     })
//   })
// }

// export async function getTasks(req, res, next) {
//   try {
//     const { search, status = 'all', priority } = req.query
//     const data = await readTask()
//     let tasks = data.todos

//     if (search && typeof search === 'string') {
//       const searchText = search.toLowerCase()

//       tasks = tasks.filter((task) => {
//         return (
//           task.title?.toLowerCase().includes(searchText) ||
//           task.isImpotant?.toLowerCase().includes(searchText) ||
//           task.tags?.some((tag) => tag.toLowerCase().includes(searchText))
//         )
//       })
//     }

//     if (status === 'completed') {
//       tasks = tasks.filter((task) => {
//         task.isCompleted === 'true'
//       })
//     } else if (status === 'pending') {
//       tasks = tasks.filter((task) => {
//         task.isCompleted === 'false'
//       })
//     }

//     if (priority && typeof priority === 'string') {
//       tasks = tasks.filter((task) => {
//         task.isImpotant?.toLowerCase() === priority.toLowerCase()
//       })
//     }

//     tasks.sort((a, b) => {
//       if (a.updatedAt || b.updatedAt)
//         return new Date(b.updatedAt) - new Date(a.updatedAt)
//       return new Date(b.createdAt) - new Date(a.createdAt)
//     })

//     res.json(tasks)
//   } catch (e) {
//     next(e)
//   }
// }

// export async function addTask(req, res, next) {
//   const validatedData = await validateRequest(taskCreateSchema, req.body, next)
//   if (!validatedData) return
//   try {
//     const newTask = validatedData
//     const data = await readTask()
//     data.tasks.push(newTask)
//     await writeTask(data)

//     res.status(201).json(newTask)
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       err.status = 400
//     }
//     next(err)
//   }
// }

// export async function deleteTask(req, res, next) {
//   try {
//     const todos = await readTask()
//     const deleteTodoId = parseInt(req.params.id)
//     const index = todos.findIndex((todo) => todo.id === deleteTodoId)
//     if (index === -1) {
//       return res.status(404).json({ message: 'Todo not found' })
//     } else {
//       res.json(todos[index])
//       todos.splice(index, 1)
//       await writeTask(todos)
//       res.status(201).json({ message: 'todo deleted successfully' })
//     }
//   } catch (e) {
//     next(e)
//   }
// }

// export async function updateTask(req, res, next) {
//   try {
//     const todos = await readTask()
//     const updateTodoId = parseInt(req.params.id)
//     const index = todos.findIndex((todo) => todo.id === updateTodoId)
//     if (index === -1) {
//       return res.status(404).json({ message: 'Todo not found' })
//     } else {
//       todos[index] = { ...todos[index], ...req.body }
//       await writeTask(todos)
//       res.status(201).json(todos[index])
//     }
//   } catch (e) {
//     next(e)
//   }
// }
