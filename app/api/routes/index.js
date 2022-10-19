const { Router } = require('express');
const auth = require('../middlewares/auth-mw');
const router = Router({ mergeParams: true });

router.use('/auth', require('./auth'));
router.use(auth, require('./restify'));

module.exports = router;
