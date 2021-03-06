const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')


const Profile = require('../../models/Profile')
const User = require('../../models/User')
const validateProfileInput = require('../../validation/profile')
//@route GET api/profile/test
//@desc Testira Profile rutu
//@access Public
router.get('/test', (req, res) => {
    res.json({msg: "Profile works"})
})

//@route GET api/profile
//@desc Vraca profil trenutnog korisnika
//@access Private 

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {}
    
    Profile.findOne({ user: req.user.id})
      .populate('user', ['name', 'email'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'Profile not found'
          return res.status(404).json(errors)
        }

        res.json(profile)
      })
      .catch(err => res.status(404).json(err))
})

//@route GET api/profile/handle/:handle
//@desc Dohvati profil na osnovu hendla
//@access Public

router.get('/handle/:handle', (req, res) => {
  const errors = {}

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'email'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = "There is no profile for this user"
        res.status(400).json({errors})
      }

      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

//@route GET api/profile/user/:user_id
//@desc Dohvati profil na osnovu id korisnika
//access Public

router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for user with this id'
        res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch((err) => console.log(err))
})

//@route GET api/profile/all
//@desc Dohvata sve profile
//@access Public

router.get('/all', (req, res)=> {
  Profile.find()
  .populate('user', ['name', 'avatar'])
  .then(profiles=> {
    if(!profiles) {
      return res.status(404).json({msg : 'There are no profiles'})
    }

    res.json(profiles)
  })
  .catch(err => res.status(404).json({msg : 'There are no profiles'}))
})
//@route POST api/profile
//@desc Kreira ili edituje profil korisnika
//@access Public

router.post('/', passport.authenticate('jwt', {session: false}),(req, res) => {
  const {errors, isValid} = validateProfileInput(req.body); 
  
  if(!isValid) {
    return res.status(400).json(errors)
  }

  const profileFields = {}
  profileFields.user =  req.user.id
  if(req.body.handle) profileFields.handle = req.body.handle
  if(req.body.occupation) profileFields.occupation = req.body.occupation
  if(req.body.location) profileFields.location = req.body.location
  if(req.body.bio) profileFields.bio = req.body.bio

  if(typeof req.body.interests !== 'undefined') {
    profileFields.interests = req.body.interests.split(',')
  }
  
  //Za Social

  profileFields.social = {}
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram

  Profile.findOne({ user: req.user.id})
    .then(profile => {
        if(profile) {
          Profile.findOneAndUpdate( {user: req.user.id}, {$set: profileFields}, {new: true})
            .then(profile => res.json(profile))
            .catch(err => console.log(err)) 
            
        } else {
          Profile.findOne({handle : profileFields.handles})
            .then(profile => {
              if (profile) {
                errors.handle = 'This handle already exists'
                res.status(400).json(errors)
              }

              new Profile(profileFields).save()
                .then(profile => res.json(profile))
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        }
    })
})


module.exports = router