const express = require('express');
const asyncHandler = require('express-async-handler');
const requestCtrl = require('../controllers/request.controller');
const requireComprador = require('../middleware/require-comprador');
const passport = require('passport');

const router = express.Router();
module.exports = router;

router.get('/', requireComprador ,getAll);
router.get('/MyRequests', passport.authenticate('jwt', { session: false }) ,getMyRequests);
router.get('/masterData' , passport.authenticate('jwt', { session: false }) , getAccountGroup);
router.get('/:id', passport.authenticate('jwt', { session: false }) ,getTraceHistory);
router.post('/masterData' , passport.authenticate('jwt', { session: false }) ,requestCtrl.postAccountGroup);
router.put('/masterData/:id' , passport.authenticate('jwt', { session: false }) ,requestCtrl.putAccountGroup);

async function getAll(req, res) {
  let users = await requestCtrl.getRequests();
  res.json(users);
}

async function getMyRequests(req, res) {
  let users = await requestCtrl.getMyRequests(req);
  res.json(users);
}

async function getTraceHistory(req, res) {
  let users = await requestCtrl.getTraceHistory(req);
  res.json(users);
}

async function getAccountGroup(req, res) {
  let users = await requestCtrl.getAccountGroup(req);
  res.json(users);
}