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

router.get('/post/:id', withAuth, async (req, res) => {
  console.log("look at post menu");
  console.log(req.params.id);
  let postData = await Post.findByPk(req.params.id, {
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
  postData = postData.get({plain: true});
  return res.render('post-menu', {
    postData,
    loggedIn: req.session.loggedIn
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

router.delete('/post/:id/delete', async (req, res) => {
  console.log("post delete attempt")
    try {
        const commentData = await Comment.destroy({
            where: {
              post_id: Number(req.params.id)
            }
        });
        const dbUserData = await Post.destroy({
            where: {
              id: Number(req.params.id)
            }
        });
        res.status(204).json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;