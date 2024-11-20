const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/user.controller');
const validate = require('../../validate/user.validate');

const multer  = require('multer');
const upload = multer();

router.get('/login', controller.login);
router.post('/login', controller.loginPost);

router.get('/register', controller.register);
router.post('/register', validate.register, controller.registerPost);

router.get('/logout', controller.logout);


module.exports = router;