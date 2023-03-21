const router = require('express').Router();
const { User } = require('../models');

router.get('/', (req, res) => {
    return res.render('login');
});

router.post('/login', async (req, res) => {
    console.log("log in attempt")
    try {
        const dbUserData = await User.findOne({
          where: {
            email: req.body.email,
          },
        });
        if (!dbUserData) {
            res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
            return;
        }
        const validPassword = await dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
            return;
        }
        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.userID = dbUserData.get({ plain: true }).id;
        });
        return res.render('home');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/logout', async (req, res) => {
    console.log("log out attempt")
    console.log(req.session.loggedIn);
    if (req.session.loggedIn) {
        req.session.destroy(() => {
          res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

router.post('/new', async (req, res) => {
    console.log("signup attempt")
    try {
        const dbUserData = await User.create({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        req.session.save(() => {
          req.session.loggedIn = true;
          req.session.userID = dbUserData.get({ plain: true }).id;
        });
        return res.render('home');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;