const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  console.log(req.session);
  const rawPostData = await Post.findAll({
    where: {
      user_id: req.session.userID,
    },
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

router.get('/new', withAuth, async (req, res) => {
  return res.render('add-post', {
    loggedIn: req.session.loggedIn,
    userID: req.session.userID
  });
});

router.post('/new/add', async (req, res) => {
  console.log("post add attempt")
    try {
        const dbUserData = await Post.create({
            title: req.body.postTitle,
            contents: req.body.postContent,
            user_id: req.session.userID,
            date: Date.now()
        });
        res.status(200).json("ok");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;