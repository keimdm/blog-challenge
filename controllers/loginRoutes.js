const router = require('express').Router();

router.get('/', (req, res) => {
    console.log("login route");
    return res.render('login');
});

module.exports = router;