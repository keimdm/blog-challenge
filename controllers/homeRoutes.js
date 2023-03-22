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

router.get('/post/:id/comment', async (req, res) => {
  console.log("Navigate to new comment:");
  console.log(req.params.id);
  return res.render('add-comment', {
    postID: req.params.id,
    loggedIn: req.session.loggedIn
  });
});

router.post('/post/:id/comment/add', async (req, res) => {
  console.log("comment add attempt")
  console.log(req.params.id);
    try {
        const dbUserData = await Comment.create({
            contents: req.body.commentText,
            user_id: req.session.userID,
            post_id: req.params.id,
            date: Date.now()
        });
        res.status(200).json("ok");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;