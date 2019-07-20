const express = require('express');
const notificationCtrl = require('../controllers/notification.controller');
const requireAdmin = require('../middleware/require-admin');

const router = express.Router();
module.exports = router;

router.route('/getAll')
  .get(notificationCtrl.getAll);

router.route('/:id')
  .get(notificationCtrl.getNotification)
  .put(notificationCtrl.editNotification)
  .delete(notificationCtrl.deleteNotification)

router.post('/', requireAdmin, notificationCtrl.newNotification)
router.get('/', requireAdmin, notificationCtrl.getNotificationByDate)
