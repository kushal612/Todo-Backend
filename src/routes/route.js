import { Router } from 'express';
import Control from '../controller/Control.js';
import TodoValidations from '../validation/middleware/TodoValidation.js';
//import AuthenticationController from '../controller/authControler.js';

//const authentication = new AuthenticationController();
const validationMiddleware = new TodoValidations();
const control = new Control();
const router = Router();

router.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`);
  next();
});

router.post('/', validationMiddleware.validateRequest, control.postDocument);
router.put('/:id', validationMiddleware.updateRequest, control.updateDocument);
router.get('/', control.getDocuments);
router.get('/:id', control.getDocumentById);
router.delete('/:id', control.deleteById);
router.delete('/clear/completed', control.clearCompletedTasks);
router.delete('/clear/all', control.clearAllTasks);
// router.post('/reset-password', authentication.resetPassword);

export default router;
