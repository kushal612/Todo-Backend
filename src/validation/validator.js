export const validateRequest = async (schema, data, next) => {
  try {
    const validatedData = await schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    })
    return validatedData
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400
    }
    next(err)
  }
}
