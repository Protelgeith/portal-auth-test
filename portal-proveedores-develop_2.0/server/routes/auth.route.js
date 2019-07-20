const express = require('express');
const asyncHandler = require('express-async-handler')
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const requireAdmin = require('../middleware/require-admin');
const requireComprador = require('../middleware/require-comprador');
const router = express.Router();
module.exports = router;


router.post('/register', requireAdmin, register);
router.post('/registerUser', requireComprador, insertUser);
router.post('/login', passport.authenticate('local', { session: false }), login);
router.get('/me', passport.authenticate('jwt', { session: false }), login);
router.post('/refresh-token', passport.authenticate('jwt', { session: false }), refreshToken);
router.route('/confirm-account/:id').get(asyncHandler(confirmAccount));
router.route('/reset-password/:email').get(asyncHandler(sendResetPassword));
router.route('/reset-password/:token').post(asyncHandler(resetPassword));
router.route('/settings').get(asyncHandler(getSettings));
router.route('/settings/:id').post(asyncHandler(updateSettings));

 function register(req,res) {
  userCtrl.insert(req,res);
}

function insertUser(req,res) {
  userCtrl.insertUser(req,res);
}

function confirmAccount(req,res) {
  authCtrl.confirmAccount(req , res);
 }

 function sendResetPassword(req,res) {
  authCtrl.sendResetPassword(req , res);
 }
 
 
 function resetPassword(req,res) {
  authCtrl.resetPassword(req , res);
 }

 function refreshToken(req,res) {
  authCtrl.refreshToken(req , res);
 }
 
 function getSettings(req,res) {
  authCtrl.getSettings(req , res);
 }

 function updateSettings(req,res) {
  authCtrl.updateSettings(req , res);
 }
 
 
function login(req, res) {
  let user = req.body;
  let token = authCtrl.generateToken(user).then(token =>{
    res.json({ token })
  })
  .catch(error => {
    res.status(500).json({ error })
  })
}