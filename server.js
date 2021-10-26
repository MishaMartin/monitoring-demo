const express = require('express')

const path = require('path')
const Rollbar = require('rollbar')

let rollbar = new Rollbar({
    accessToken: '7c96bc0d6d0646de97a7ff0d09495821',
    captureUncaught: true,
    captureUnhandledRejections: true
    // the captures are specifying what types of rejections we want it to handle
})

const app = express()

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info('html file served successfully')
})

const port = process.env.PORT || 4545

app.listen(port, () => console.log(`Take us to warp ${port}!`))