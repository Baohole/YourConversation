const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/friends.controller');

router.get('/', controller.index);
router.get('/request', controller.request);
router.get('/request-sent', controller.requestSent);


module.exports = router;