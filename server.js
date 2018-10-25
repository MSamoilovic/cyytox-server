const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express();
const server = http.createServer(app)
const io = socketIO(server)

const ProfileSchema = require('./models/Profile')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

// Passport
app.use(passport.initialize())

require('./config/passport')(passport)

//Setovanje baze
const db = require('./config/keys').mongoURL;

//Vezivanje baze 

mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))

app.get('/', (req, res) => res.send('Hello'));

//Koriscenje Ruta

app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const port =  process.env.PORT || 5000;


//Dodavanje Socketa
io.on('connection', (socket)=> {
  
})


server.listen(port, () => console.log(`Server running on port ${port}`))