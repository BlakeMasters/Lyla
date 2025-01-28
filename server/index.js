const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const mongoose = require('mongoose')


dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err))

dotenv.config()
const port = process.env.PORT
const secretKey = process.env.SECRET_KEY

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Express + MongoDB + JWT API running')
})

app.use('/api/users', require('./routes/userRoutes'))

app.get('/api/greeting', (req, res) => {
  res.json({ message: 'Hello from the Express API!' })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})