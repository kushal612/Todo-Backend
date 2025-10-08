import { Router } from 'express'
import {
  // getTasks,
  // addTask,
  // updateTask,
  // deleteTask,
  postDocument,
  getDocument,
  getDocumentById,
} from '../controller/control.js'

const router = Router()

router.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`)
  next()
})

// router.get('/todos', getTasks)
// router.post('/todos', addTask)
// router.put('/todos:id', updateTask)
// router.delete('/todos:id', deleteTask)

router.post('/tasks', postDocument)
router.get('/tasks', getDocument)
router.get('/tasks/:id', getDocumentById)
export default router
