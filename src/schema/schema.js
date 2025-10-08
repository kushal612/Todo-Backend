import * as yup from 'yup'
import { randomUUID } from 'crypto'
import { getISTLocalizedTime } from '../utils/utils.js'

export const taskCreateSchema = yup.object({
  id: yup.string().default(() => randomUUID()),
  title: yup.string().trim().required('Title is required'),
  tags: yup.array().of(yup.string()).default([]),
  isImpotant: yup.string().default(''),
  isCompleted: yup.boolean().default(false),
  createdAt: yup.string().default(() => getISTLocalizedTime()),
  updatedAt: yup.string().default(() => getISTLocalizedTime()),
})

export const taskUpdateSchema = yup.object({
  title: yup.string().trim(),
  tags: yup.array().of(yup.string()),
  isImpotant: yup.string(),
  isCompleted: yup.boolean(),
})
