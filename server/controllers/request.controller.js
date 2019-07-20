const userInfoModel =  require('../models/vendor-info.model');
const preModel = require('../models/preregistration.model');
const AccountGroupModel = require('../models/master-data.model');
const TraceHistoryModel = require('../models/trace-history.model');
const logsModel = require('../models/logs.model')
const ReadPreference = require('mongodb').ReadPreference;
const passport = require('passport');

module.exports = {
  getRequests,
  getMyRequests,
  getTraceHistory,
  getAccountGroup,
  postAccountGroup,
  putAccountGroup,
}

/*
** Funcion para obtener todas las solicitudes
** pre-registrados y registrados
** @admin
** @comprador
*/
async function getRequests() {
  var results;
  var usersPre = await preModel.find();
  var usersRegistrados = await userInfoModel.find().populate('Logs');
  var results = usersPre.concat(usersRegistrados)
  return results
}

/*
** Funcion para obtener todas las solicitudes del proveedor.
** pre-registrados y registrados
** @proveedor
*/
async function getMyRequests(req) {
  var rfc = req.query.rfc;
  var results;
  var usersPre = await preModel.find({'user.rfc' : rfc});
  var usersRegistrados = await userInfoModel.find({'user.rfc' : rfc}).populate('Logs');
  var results = usersPre.concat(usersRegistrados)
  return results
}

/*
** Funcion para obtener todas los registros de cambios.
** @all
*/
async function getTraceHistory(req) {
  var id = req.params.id;
  var trace = await TraceHistoryModel.find({'requestId' : id});
  return trace
} 

/*
** Funcion para obtener los datos maestros.
** @Comprador / Admin
*/
async function getAccountGroup() {
  var usersPre = await AccountGroupModel.find();
  return usersPre
} 

/*
** Funcion para postear los datos maestros.
** @Comprador / Admin
*/
function postAccountGroup(req, res) {
  var body = req.body;
  const data = {
    masterData : {
    accountGroup: body.datosMaestros.grupoCuentas,
    conceptBus: body.datosMaestros.conceptoBus1,
    associateAcount: body.datosMaestros.cuentaAsociada,
    treasuryGroup: body.datosMaestros.grupoTesoreria,
    society: body.datosMaestros.sociedad,
    comForm: body.datosMaestros.formaCom,
    singleEntry: body.datosMaestros.entradaInd,
    verifyFac: body.datosMaestros.verifFac,
    salesOrg: body.datosMaestros.orgCompras,
    language: body.datosMaestros.idioma,
    retentionSing01: body.datosMaestros.retencionInd01,
    retentionType01: body.datosMaestros.retencionTipo01,
    subject01: body.datosMaestros.sujeto01,
    branch: body.datosMaestros.ramo,
    paymentWay: body.datosMaestros.viaPago,
    retentionSing02: body.datosMaestros.retencionInd02,
    retentionType02: body.datosMaestros.retencionTipo02,
    subject02: body.datosMaestros.sujeto02,
    }
  };

  const accountGroup = new AccountGroupModel(data);
  accountGroup.save()
    .then(preVendors => {
      res.status(200).json(preVendors);
    })
    .catch(error => res.status(500).send(error));
} 

/*
** Funcion para actualizar los datos maestros.
** @Comprador / Admin
*/
function putAccountGroup(req, res) {
  var id = req.params.id;
  var body = req.body;
  const data = {
    masterData : {
    accountGroup: body.datosMaestros.grupoCuentas,
    conceptBus: body.datosMaestros.conceptoBus1,
    associateAcount: body.datosMaestros.cuentaAsociada,
    treasuryGroup: body.datosMaestros.grupoTesoreria,
    society: body.datosMaestros.sociedad,
    comForm: body.datosMaestros.formaCom,
    singleEntry: body.datosMaestros.entradaInd,
    verifyFac: body.datosMaestros.verifFac,
    salesOrg: body.datosMaestros.orgCompras,
    language: body.datosMaestros.idioma,
    retentionSing01: body.datosMaestros.retencionInd01,
    retentionType01: body.datosMaestros.retencionTipo01,
    subject01: body.datosMaestros.sujeto01,
    branch: body.datosMaestros.ramo,
    paymentWay: body.datosMaestros.viaPago,
    retentionSing02: body.datosMaestros.retencionInd02,
    retentionType02: body.datosMaestros.retencionTipo02,
    subject02: body.datosMaestros.sujeto02,
    }
  }

  const accountGroup = AccountGroupModel.findByIdAndUpdate(id, data).read(ReadPreference.NEAREST);
  accountGroup
    .exec()
      .then(updatedAccountGroup => {
        res.status(200).json(updatedAccountGroup);
      })
      .catch(error => res.status(500).send(error));
} 
