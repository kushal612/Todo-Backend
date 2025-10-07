import fs from 'fs'
import path from 'path'
//import { randomUUID } from 'crypto'
//import { getISTLocalizedTime } from '../utils/utils.js'
import { taskCreateSchema } from '../validation/validator.js'

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
    const { search } = req.query
    const data = await readTask()
    let tasks = data.todos

    if (search && typeof search === 'string') {
      const searchText = search.toLowerCase()

      tasks = tasks.filter((task) => {
        return (
          task.title?.toLowerCase().includes(searchText) ||
          task.isImportant?.toLowerCase().includes(searchText) ||
          task.tags?.some((tag) => tag.toLowerCase().includes(searchText))
        )
      })
    }

    res.json(tasks)
  } catch (e) {
    next(e)
  }
}

export async function addTask(req, res, next) {
  try {
    const validatedData = await taskCreateSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    const newTask = validatedData
    const data = await readTask()
    data.tasks.push(newTask)
    await writeTask(data)

    res.status(201).json(newTask)
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400
    }
    next(err)
  }
  //     const todos = await readTask()
  //     const newId = randomUUID()
  //     const newTodoWithId = {
  //       id: newId,
  //       title: title.trim(),
  //       tags: Array.isArray(tags) ? tags : [],
  //       isImpotant: isImpotant.trim(),
  //       isCompleted: false,
  //       createdAt: getISTLocalizedTime(),
  //       updatedAt: getISTLocalizedTime(),
  //     }
  //     todos.push(newTodoWithId)
  //     await writeTask(todos)
  //     res.status(201).json(newTodoWithId)
  //   } catch (e) {
  //     next(e)
  //   }
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

// export async function searchTask(req, res, next) {
//   try {
//     const todos = await readTask()

//     const { q, currentFilter, isImportantFilter } = req.query

//     const query = q ? q.toLowerCase() : ''

//     let importanceFilterArray = []
//     if (Array.isArray(isImportantFilter)) {
//       importanceFilterArray = isImportantFilter.map((val) => val.toLowerCase())
//     } else if (
//       typeof isImportantFilter === 'string' &&
//       isImportantFilter.length > 0
//     ) {
//       importanceFilterArray = isImportantFilter.toLowerCase().split(',')
//     }

//     importanceFilterArray = importanceFilterArray.filter((val) => val !== 'all')

//     let visibleTasks = todos.filter((t) => {
//       if (currentFilter === 'current' && t.isCompleted) return false
//       if (currentFilter === 'completed' && !t.isCompleted) return false

//       if (importanceFilterArray.length > 0) {
//         const taskImportance = t.isImpotant
//           ? String(t.isImpotant).toLowerCase()
//           : 'low'

//         if (!importanceFilterArray.includes(taskImportance)) {
//           return false
//         }
//       }

//       if (query) {
//         const matchesTitle = t.title.toLowerCase().includes(query)

//         const matchesTag = t.tags.some((tag) =>
//           tag.toLowerCase().includes(query)
//         )

//         if (!matchesTitle && !matchesTag) {
//           return false
//         }
//       }

//       return true
//     })

//     res.json(visibleTasks)
//   } catch (e) {
//     next(e)
//   }
// }

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
