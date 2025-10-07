import { Router } from 'express'
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from '../controller/control.js'

const router = Router()

router.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`)
  next()
})

router.get('/todos', getTasks)
router.post('/todos', addTask)
router.put('/todos/:id', updateTask)
router.delete('/todos/:id', deleteTask)

export default router
