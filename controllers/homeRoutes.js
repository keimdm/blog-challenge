const router = require('express').Router();
const { User } = require('../models');

router.get('/', async (req, res) => {
  const firstUser = await User.findByPk(1);
  console.log(firstUser.dataValues);
  return res.render('home', firstUser.dataValues);
});

router.get('/login', async (req, res) => {
  console.log("login route");
  return res.render('login');
});

module.exports = router;