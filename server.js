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
const wardrobeRouter = require('./routes/wardrobe_router')
const outfitRouter = require('./routes/outfit_router')
const componentRouter = require('./routes/component_router')

app.use('/api/wardrobe', wardrobeRouter)
app.use('/api/outfit', outfitRouter)
app.use('/api/component', componentRouter)

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