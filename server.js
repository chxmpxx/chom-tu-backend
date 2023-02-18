const express = require('express')
const cors = require('cors')
const upload = require('express-fileupload')

const app = express()

var corOption = {
    origin: 'https://localhost:8081'
}

// middleware
app.use(cors(corOption))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(upload())

// router
const router = require('./routes/wardrobe_router')
app.use('/api/wardrobe', router)

// testing api
app.use('/chomtu', (req, res) => {
    res.json({ message: 'hello from ChomTu api' })
})

// port
const PORT = process.env.PORT || 3000

// server
app.listen(PORT, () => {
    console.log('server is running on port ', PORT);
})