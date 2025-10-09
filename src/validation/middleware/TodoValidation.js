import { postSchema, updateSchema } from '../schema/todoValidationSchema.js';

export default class TodoValidations {
  validateRequest = async (req, res, next) => {
    try {
      await postSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      next();
    } catch (err) {
      if (err.name === 'ValidationError') {
        err.status = 400;
        next(new Error(err.errors.join(', ')));
      }

      console.log({ err });
      next(err);
    }
  };

  updateRequest = async (req, res, next) => {
    try {
      await updateSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      next();
    } catch (err) {
      if (err.name === 'ValidationError') {
        err.status = 400;
      }

      next(err);
    }
  };
}
