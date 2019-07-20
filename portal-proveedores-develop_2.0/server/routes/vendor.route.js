const express = require('express');
const asyncHandler = require('express-async-handler');
const vendorCtrl = require('../controllers/vendor.controller');
const requireComprador = require('../middleware/require-comprador');

const router = express.Router();
module.exports = router;

router.route('/prueba')
  .get(vendorCtrl.getAll)
 
router.route('/:id')
  .get(vendorCtrl.getVendor)

router.post('/:id' , requireComprador , vendorCtrl.vendorAuthorization)
router.put('/:id' , requireComprador , vendorCtrl.updateVendorInfo)
router.put('/auth/:id' , requireComprador , vendorCtrl.vendorPreAuthorization)
router.patch('/:id' , requireComprador , vendorCtrl.vendorRejection)
router.patch('/admin/:id' , requireComprador , vendorCtrl.adminRejection)
