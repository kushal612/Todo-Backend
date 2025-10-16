import { Router } from 'express';
import Control from '../controller/Control.js';
import TodoValidations from '../validation/middleware/TodoValidation.js';

const validationMiddleware = new TodoValidations();
const control = new Control();
const router = Router();

router.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`);
  next();
});
router.post(
  '/tasks',
  validationMiddleware.validateRequest,
  control.postDocument
);
router.put(
  '/tasks/:id',
  validationMiddleware.updateRequest,
  control.updateDocument
);
router.get('/tasks', control.getDocuments);
router.get('/tasks/:id', control.getDocumentById);
router.delete('/tasks/:id', control.deleteById);
router.delete('/tasks/clear/completed', control.clearCompletedTasks);
router.delete('/tasks/clear/all', control.clearAllTasks);

export default router;
