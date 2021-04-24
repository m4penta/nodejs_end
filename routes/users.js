var express = require('express');
var router = express.Router();
var controller = require('../controllers/users');
const auth = require('../middleware/auth');

/* GET users listing. */
router.get('/', controller.getUsers)
router.get('/:userId',auth.authentication,controller.getUsersByID)
router.post('/save', controller.createUser)
router.post('/update', controller.updateUser)
router.get('/delete/:userId', controller.delUserByID)
router.post('/checklogin', controller.checklogin)

module.exports = router;
