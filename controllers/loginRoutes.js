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
        console.log(dbUserData);
        if (!dbUserData) {
            res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
            return;
        }
        const validPassword = await dbUserData.checkPassword(req.body.password);
        console.log(validPassword);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
            return;
        }
        req.session.save(() => {
            req.session.loggedIn = true;
        });
        return res.render('home');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/new', (req, res) => {
    console.log("signup attempt")
    return res.render('home');
});

module.exports = router;