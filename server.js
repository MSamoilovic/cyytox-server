const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

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

app.listen(port, () => console.log(`Server running on port ${port}`))