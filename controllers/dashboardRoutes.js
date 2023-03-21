const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

router.get('/', async (req, res) => {
  const rawPostData = await Post.findAll({
    include: [{ model: User }],
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT name FROM user WHERE user.id = post.user_id)'
          ),
          'username',
        ],
      ],
    },
  });
  let postData = [];
  for (i = 0; i < rawPostData.length; i++) {
    postData.push(rawPostData[i].get({ plain: true }));
  }
  console.log(postData);
  return res.render('dashboard', {
    postData,
    loggedIn: req.session.loggedIn,
    userID: req.session.userID
  });
});

module.exports = router;