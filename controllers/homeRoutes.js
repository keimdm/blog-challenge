const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  console.log(req.session);
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
  return res.render('home', {
    postData,
    loggedIn: req.session.loggedIn
  });
});

router.get('/post/:id', withAuth, async (req, res) => {
  console.log("look at post details");
  console.log(req.params.id);
  let postData = await Post.findByPk(req.params.id);
  postData = postData.get({plain: true});
  let rawCommentData = await Comment.findAll({
    where: {
      post_id: req.params.id,
    },
    include: [{ model: User }],
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT name FROM user WHERE user.id = comment.user_id)'
          ),
          'username',
        ],
      ],
    },
  });
  let commentData = [];
  for (i = 0; i < rawCommentData.length; i++) {
    commentData.push(rawCommentData[i].get({ plain: true }));
  }
  return res.render('post-comment', {
    postData,
    commentData,
    loggedIn: req.session.loggedIn
  });
});


module.exports = router;