import express from 'express'
import dotenv from 'dotenv'
import router from './routes/route.js'
import cors from 'cors'
import connectDB from './db/mongo.js'

dotenv.config()
const port = process.env.PORT

connectDB()
const app = express()

app.use(cors())
app.use(express.json())

// eslint-disable-next-line
app.use((err, res, req, next) => {
  try {
    const status = err.status || 500
    res.status(status).join({
      error: err.message || 'Server Error',
    })
  } catch (e) {
    res.status(400).json('error: ', e)
  }
})

//app.use('/api/tasks', router)

app.use('/api', router)
app.listen(port, () => {
  console.log(`"message": "server is up and running"`)
})
