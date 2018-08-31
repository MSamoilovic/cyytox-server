const express = require('express')
const router = express.Router()

//@route GET api/posts/test
//@desc Testira post rutu
//@access Public
router.get('/test', (req, res) => {
    res.json({msg: "Posts works"})
})

module.exports = router