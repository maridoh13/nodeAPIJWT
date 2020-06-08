const router = require('express').Router();
const verify = require('./verifyToken');
const Post = require('../model/Post');



router.get('/', (req, res) => {
   
  Post.find({}, function(err, docs) {
    res.send(docs);
  });

  
})

router.post('/', async (req, res) => {

  const post = new Post({
    name: req.body.name,
    text: req.body.text
  })

  try {
    const savedPost = await post.save();
    res.send("Post saved!");
  } 
  catch(err) {
    res.status(400).send(err)
  }
  
})




module.exports = router;