const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/chat.controller');

const groupValidate = require('../../validate/creatGroup.validate');
router.get('/', controller.index);
router.get('/:id', controller.roomChat);
router.post('/create/group', groupValidate, controller.creatGroupChat);

module.exports = router;