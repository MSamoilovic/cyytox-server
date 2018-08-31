const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

//Ucitava User model
const User  = require('../../models/User')
const keys = require('../../config/keys')

//@route GET api/users/test
//@desc Testira users rutu
//@access Public

router.get('/test', (req, res) => {
    res.json({msg: "Users works"})
})


//@route POST api/users/register
//@desc Registruje novog usera
//@access Public

router.post('/register', (req, res) => {
    User.findOne({email : req.body.email})
      .then(user => {
        if (user) {
            return res.status(400).json({msg: 'Email already exists'})
        } else {
            const newUser = new User ({
                name : req.body.name,
                email : req.body.email,
                password: req.body.password
            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) console.log(err);
                    newUser.password = hash
                    newUser.save()
                      .then( user => res.json(user))
                      .catch(err => console.log(err))
                })
            })
        }
    })
})


//@route POST api/users/login
//@desc Login za vec postojeceg usera
//@access Public

router.post('/login', (req, res) => {
    const email =  req.body.email;
    const password = req.body.password;

    User.findOne({email})
      .then(user => {
        if(!user) {
            return res.status(404).json({msg: 'User not found'})
        }

        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if(isMatch) {
              //Kada je User pogodjen
              const payload = { id: user.id, name: user.name} //Payload za JWT token

              jwt.sign(payload, keys.secret, {expiresIn: 3600}, (err, token) => {
                res.json({
                    success: true,
                    token: `Bearer ${token}`
                })
              }) 
            } else {
              res.status(400).json({msg: 'Invalid password'})
            } 
          })
          .catch(err => console.log(err)) 
      })
})

//@route GET api/users/current
//@desc Vrati mi trenutnog usera
//@access Privjet

router.get('/current', passport.authenticate('jwt', {session : false}), (req, res) => {
    res.json({msg: 'Success'})
})

module.exports = router