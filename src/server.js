import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT

const app = express()

const sc = {
    success: true,
    message: `server is up and running ${port}`,
}

app.get('/', (req, res) => {
    res.send(sc)
})

app.listen(port, () => {
    console.log(`"message": "server is up and running"`)
})
