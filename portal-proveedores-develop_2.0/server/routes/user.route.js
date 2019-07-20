const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))

router.route('/:id')
  .post(asyncHandler(userCtrl.insert));

router.route('/:id')
  .put(asyncHandler(userCtrl.editUser));

router.route('/:id')
  .delete(asyncHandler(userCtrl.deleteUser));
