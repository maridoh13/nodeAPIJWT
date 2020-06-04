const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

// REGISTRATION

router.post('/register', async (req, res) => {
  //Validation of data before adding user
  const { error } = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  //Checking if user is already in DB
  const emailExist = await User.findOne({email: req.body.email});
  if (emailExist) return res.status(400).send('Email already exists');

  //Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } 
  catch(err) {
    res.status(400).send(err)
  }

});

// LOGIN

router.post('/login', async (req, res) => {
  //Validation of data before adding user
  const { error } = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  //Checking if email exists
  const user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send('Email not found');

  //Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if(!validPass) return res.status(400).send('password incorrect');

  //Create and assign a token
  const token = jwt.sign({_id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);


  // res.send('Logged in');
});


module.exports = router;