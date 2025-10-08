import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.MONGO_PASS

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
