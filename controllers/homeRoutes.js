const router = require('express').Router();
const { User } = require('../models');

router.get('/', async (req, res) => {
  const firstUser = await User.findByPk(1);
  console.log(firstUser.dataValues);
  return res.render('home', firstUser.dataValues);
});

module.exports = router;