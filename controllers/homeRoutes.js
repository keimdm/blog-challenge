const router = require('express').Router();
const { User } = require('../models');

router.get('/', async (req, res) => {
  console.log("home route");
  const firstUser = await User.findByPk(1);
  return res.render('home', firstUser.dataValues);
});

module.exports = router;