const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const validatePostInput = require('../../validation/posts')

//@route GET api/posts/test
//@desc Testira post rutu
//@access Public
router.get('/test', (req, res) => {
    res.json({msg: "Posts works"})
})

//@route POST api/posts/
//@desc Kreira post
//@access Private

router.post('/', passport.authenticate('jwt', {session: false}),(req, res) => {
    const { errors, isValid} = validatePostInput(req.body)
    
    if(!isValid) {
      return res.status(400).json(errors)
    }

    const newPost = new Post ({
        text: req.body.text,
        name: req.body.name,
        user: req.user.id
    });

    newPost.save().then( post => res.json(post))
})

//@route GET api/posts
//@desc Dobavlja sve postove
//@access Pubic

router.get('/' , (req, res) => {
    Post.find()
     .sort({date: -1})
     .then(posts => res.json(posts))
     .catch(err => res.status(404).json({nopostfound : 'No posts found'}))
})

//@route GET api/posts/:id
//@desc Dobavlja post sa odredjenim ID
//@access Public

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
     .then(post => res.json(post))
     .catch(err => res.status(404).json(err))
})

//@route DELETE api/posts/:id
//@desc Brise post sa odredjenim ID
//@access Private

router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
    //eslint-disable-next-line
     .then(profile => {
        Post.findById(req.params.id)
         .then(post => {
            if(post.user.toString() !== req.user.id) {
              return res.status(401).json({authorized: 'Not Authorized'})
            }

            post.remove()
             .then(() => res.status(200).json({success: 'true'}))
             .catch(err => console.log(err))
         })
         .catch(err => res.json(err))
     })
     .catch(err => res.status(404).json({user: 'User not found'}))

})

//@route POST api/posts/like/:id
//@desc Dodaje like funkcionalnost
//@access Private

router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
   .then(profile => {
    Post.findById(req.params.id)
     .then(post => {
        if(post.likes.filter(like => like.user.toString() === req.user._id).length > 0) {
          return res.status(400).json({alreadyliked: 'You already liked this post'})    
        }

        post.likes.push({user: req.user.id});

        post.save().then(post => res.json(post))
     })
     .catch(err => res.json(err)) 
   })
   .catch(err => res.json(err))
})

//@route POST api/posts/unlike/:id
//@desc Unlike za post
//@access Private

router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
     .then(profile => {
        Post.findById(req.params.id)
         .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length == 0) {
                return res.status(400).json({unliked: 'You have not liked post'})
            }

            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id)

            post.likes.splice(removeIndex, 1)

            post.save().then(post => res.json(post))
         })
         .catch(err => res.json(err))
     })
     .catch(err => res.json(err))
})

//@route POST api/posts/comment/:id
//@desc Dodaje komentare na postove
//@access Private

router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { errors, isValid} = validatePostInput(req.body)
    
    if(!isValid) {
      return res.status(400).json(errors)
    }

    Post.findById(req.params.id)
     .then(post => {
        const newComment = {
            text: req.body.text,
            name: req.body.name, 
            id: req.user.id
        }

        post.comments.unshift(newComment)
        post.save().then(post => res.json(post))
     })
     .catch(err => res.status(404).json({posts: 'No posts found'}))
})

//@route DELETE api/posts/comment/:id/:comment_id
//@desc Brise komentare na postovima
//@access private

router.delete('/comment/:id/:comment_id',passport.authenticate('jwt', {session: false}), (req,res) => {
    Post.findById(req.params.id)
     .then(post => {
        if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
            return res.status(404).json({err: "Comment doesn't exist"})
        }

        const removeIndex = post.comments
         .map(item => item._id.toString())
         .indexOf(req.params.comment_id)

        post.comments.splice(removeIndex, 1)
        
        post.save().then(post => res.json(post))
     })
     .catch(err => res.json(err))
})


module.exports = router