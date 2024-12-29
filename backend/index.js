const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const AuthRouter = require('./Routes/AuthRouter')
const ContentRouter = require('./Routes/ContentRouter')
require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 1818;

app.get('/ping', (req, res)=>{
    res.send('PONG')
})

app.use(bodyParser.json())
app.use(cors())
app.use('/auth', AuthRouter)
app.use('/content', ContentRouter)

app.listen(PORT, () =>{
    console.log(`Server is running on ${PORT}`)
})