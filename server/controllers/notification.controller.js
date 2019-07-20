const Model =  require('../models/notification.model');
const ReadPreference = require('mongodb').ReadPreference;

module.exports = {
  getAll,
  getNotification,
  newNotification,
  deleteNotification,
  editNotification,
  getNotificationByDate
}

/*
** Funcion para obtener todas las notificaciones
** en dashboard de notificaciones
** @admin
*/
function getAll(req, res, next){
  const docquery = Model.find({}).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(notifications => {
      res.status(200).json(notifications);
    })
    .catch(error => res.status(500).send(error));
}

/*
** Funcion para obtener 1 notificacion
** en dashboard de notificaciones
** @admin
*/
function getNotification (req, res, next){
  var id = req.params.id
  const docquery = Model.findById(id).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(notification => {
      res.status(200).json(notification);
    })
    .catch(error => res.status(500).send(error));
}

/*
** Funcion para crear notificacion
** en dashboard de notificaciones
** @admin
*/
function newNotification (req, res, next){
  var body = req.body;
  const data = {
    title: body.title,
    description: body.description,
    start: body.start,
    end: body.end,
    institution: body.institution
  };
  const newNotification = new Model(data);
  newNotification.save()
    .then(notification => {
      res.json(notification)
    })
    .catch(e => res.status(500).send(e));
}

/*
** Funcion para eliminar 1 notificacion
** en dashboard de notificaciones
** @admin
*/
function deleteNotification (req, res, next){
  var id = req.params.id
  const docquery = Model.findByIdAndRemove(id).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(notification => {
      res.status(200).json(notification);
    })
    .catch(error => res.status(500).send(error));
}

/*
** Funcion para editar 1 notificacion
** en dashboard de notificaciones
** @admin
*/
function editNotification (req, res, next){
  var id = req.params.id;
  var body = req.body;
  const data = {
    title: body.title,
    description: body.description,
    start: body.start,
    end: body.end,
    institution: body.institution
  };

  const docquery = Model.findByIdAndUpdate(id, data).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(notification => {
      res.status(200).json(notification);
    })
    .catch(error => res.status(500).send(error));
}

/*
** Funcion para obtener notificaciones por fecha
** e institucion
** @proveedor
*/
function getNotificationByDate (req, res, next){
  var tzoffset = (new Date()).getTimezoneOffset() * 60000;
  var date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1) + "Z";
  const docquery = Model.find({
   $and:[{start: {$lte: date}},{end: {$gte: date}}]
  }).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(notification => {
      res.status(200).json(notification);
    })
    .catch(error => res.status(500).send(error));
}
