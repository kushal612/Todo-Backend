import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const uri_pass = process.env.MONGO_PASS

const uri = `mongodb+srv://kushal_db_user:${uri_pass}@cluster0.tb6qusq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

export default async function connectDB() {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })

    console.log('Mongoose connected to MongoDB successfully!')
  } catch (error) {
    console.error('Mongoose connection error:', error)

    process.exit(1)
  }
}
