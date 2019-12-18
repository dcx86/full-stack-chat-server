import express from 'express'

const app = express()
const port = 3000

const server = app.listen(port, () => {
  console.log('server is running on port:', port)
})
