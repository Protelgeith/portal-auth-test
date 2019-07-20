const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const preRoutes = require('./preregistration.route')
const requestsRoutes = require('./request.route');
const vendorRoutes = require('./vendor.route');
const notificationRoutes = require('./notification.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/preregistration', preRoutes);
router.use('/requests', requestsRoutes);
router.use('/vendor', vendorRoutes),
router.use('/notification', notificationRoutes);

module.exports = router;
