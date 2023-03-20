const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const loginRoutes = require('./loginRoutes');

//router.use('/login', loginRoutes);
router.use('/', homeRoutes);

module.exports = router;
