const { Router } = require('express');
const router = Router({ mergeParams: true });
const authCtrl = require('../controls/auth');

router.post('/signup', authCtrl.signup);

router.post('/signin', authCtrl.signin);

router.all('/signout', authCtrl.signout);

module.exports = router;
