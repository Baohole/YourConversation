const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/user.controller');

router.get('/', controller.index);
router.get('/login', controller.login);
router.post('/login', controller.loginPost);

module.exports = router;