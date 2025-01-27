const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000


dotenv.config()
const port = process.env.PORT
const secretKey = process.env.SECRET_KEY

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Express Backend is running!')
})

app.get('/api/greeting', (req, res) => {
  res.json({ message: 'Hello from the Express API!' })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})