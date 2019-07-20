const express = require ('express');
//const validate = require ('express-validation');
//const paramValidation = require ('../config/param-validation');
const passport = require('passport');
const preRegistrationCtrl = require ('../controllers/preregistration.controller');
const requireComprador = require('../middleware/require-comprador');

const router = express.Router();
module.exports = router;

router.get('/', requireComprador, preRegistrationCtrl.getAllCandidates);
router.post('/', passport.authenticate('jwt', { session: false }), preRegistrationCtrl.postCandidate);
router.put('/:id', passport.authenticate('jwt', { session: false }), preRegistrationCtrl.postCompleteCandidate);
router.post('/whole', passport.authenticate('jwt', { session: false }), preRegistrationCtrl.postWholeCandidate);
router.get('/:rfc/:status',requireComprador, preRegistrationCtrl.getCandidate);
router.get('/Solicitud', passport.authenticate('jwt', { session: false }), preRegistrationCtrl.getMyRegister);

router.delete('/:rfc', requireComprador, preRegistrationCtrl.deleteCandidate);
