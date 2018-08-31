const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

//Ucitava User model
const User  = require('../../models/User')

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
module.exports = router