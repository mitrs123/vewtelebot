const express = require('express')
const app = express()
const {json} = require('express')
const partsRouter = require('./routes/parts.route.js')
const port = 3000
const dotenv = require('dotenv')
dotenv.config()
app.use(json())

app.use('/', partsRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})