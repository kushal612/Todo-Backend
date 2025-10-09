import { Router } from 'express'
// import {
//   // getTasks,
//   // addTask,
//   // updateTask,
//   // deleteTask,
//   postDocument,
//   getDocumentById,
//   updateDocument,
//   deleteById,
//   searchDocuments,
//   getDocument,
// } from '../controller/Control.js'

import Control from '../controller/control.js'
import TodoValidations from '../validation/middleware/TodoValidation.js'

const validationMiddleware = new TodoValidations()

const control = new Control()

const router = Router()

router.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`)
  next()
})

// router.get('/todos', getTasks)
// router.post('/todos', addTask)
// router.put('/todos:id', updateTask)
// router.delete('/todos:id', deleteTask)

router.post(
  '/tasks',
  validationMiddleware.validateRequest,
  control.postDocument
)
router.post(
  '/tasks/:id',
  validationMiddleware.updateRequest,
  control.updateDocument
)
router.get('/tasks/search', control.searchDocuments)
router.get('/tasks/:id', control.getDocumentById)
router.get('/tasks', control.getDocument)
router.delete('/tasks/:id', control.deleteById)

export default router
