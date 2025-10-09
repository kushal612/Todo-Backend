import * as yup from 'yup'
//import randomUUID from 'crypto'

export const postSchema = yup.object({
  //id: yup.string().default(() => randomUUID()),
  title: yup
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .required('Title is required'),
  isCompleted: yup.boolean().default(false),

  //   body: yup.string().required(),
  tags: yup.array().optional(),
  isImportant: yup.boolean().default(false),
})

export const updateSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .optional(),
  isCompleted: yup.boolean().optional(),
  tags: yup.array().optional(),
  isImportant: yup.boolean().optional(),
})
