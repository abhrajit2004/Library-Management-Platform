require('dotenv').config();
const connectdb = require('./connectdb')
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json())

app.use(cors())

connectdb();

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/v1/auth', require('./routes/auth.route'))
app.use('/api/v1/books', require('./routes/books.route'))
app.use('/api/v1/issues', require('./routes/issues.route'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})