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
app.use(express.json())

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info('html file served successfully')
})

app.get('/style', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/styles.css'))
})

let students = []

app.post('/api/student', (req,res) => {
    let {name} = req.body
    name = name.trim()

    const index = students.findIndex(studentName => studentName === name)

    if(index === -1 && name !== ''){
        students.push(name)
    rollbar.log('Student added successfully', {author: "Misha", type: 'manual entry'})
    res.status(200).send(students)
    } else if (name === ''){
        // below is what it means to have a custom error message in rollbar
        rollbar.error('No name given')
        // this will send a message to the user about what they need to do tp resolve this error
        res.status(400).send('Must provide a name.')
    } else {
        rollbar.critical('Student already exists')
        res.status(400).send('That student already exists')
    }
})

app.use(rollbar.errorHandler())

const port = process.env.PORT || 4545

app.listen(port, () => console.log(`Take us to warp ${port}!`))