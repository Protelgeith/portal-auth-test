const preVendorModel = require('../models/preregistration.model');
const vendorModel = require('../models/vendor-info.model');
const logsModel = require('../models/logs.model');
const userModel = require('../models/user.model');
const Trace = require('../models/trace-history.model');
const ReadPreference = require('mongodb').ReadPreference;
const SendEmail = require("../helpers/email");
const sendEmail = new SendEmail();
const passport = require('passport');

module.exports = {
  getAll,
  getVendor,
  vendorPreAuthorization,
  vendorAuthorization,
  vendorRejection,
  adminRejection,
  updateVendorInfo
}

/*
** Funcion de pruebas para obtener todos los usuarios e info de proveedor
** @dev
*/
function getAll(req, res, next) {
  const docquery = userModel.find({}).read(ReadPreference.NEAREST);
  // const docquery = vendorModel.remove({}).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(preVendors => {
      res.status(200).json(preVendors);
    })
    .catch(error => res.status(500).send(error));
}

/*
** Obtener un proveedor de la tabla de solicitudes
** @comprador
** @admin
*/
function getVendor(req, res, next) {
  var id = req.params.id;
  var status = req.query.status;
  const docQueryPreVendor = preVendorModel.findById(id).read(ReadPreference.NEAREST);
  const docQueryVendor = vendorModel.findById(id).read(ReadPreference.NEAREST);
  if (status != 'Solicitada') {
    docQueryVendor
      .populate('Logs')
      .exec()
      .then(vendor => {
        res.status(200).json(vendor);
      })
      .catch(error => res.status(500).send(error));
  } else {
    docQueryPreVendor
      .exec()
      .then(preVendor => {
        res.status(200).json(preVendor);
      })
      .catch(error => res.status(500).send(error));
  }
}

/*
** Autorizacion de un proveedor pre-registrado
** y envio de correo para registrar su password
** @comprador
** @admin
*/
function vendorAuthorization(req, res, next) {
  var body = req.body;
  var id = req.params.id;
  passport.authenticate('jwt', async function (err, user) {
    userEmail = user.email;
    userRFC = user.rfc;
    const data = {
      fiscalData: {
        rfc: body.datosFiscales.rfc,
        personaType: body.datosFiscales.tipoPersona,
        curp: body.datosFiscales.curp,
        name: body.datosFiscales.nombre,
        lastName1: body.datosFiscales.apellidoP,
        lastName2: body.datosFiscales.apellidoM,
        street: body.datosFiscales.calle,
        number: body.datosFiscales.numero,
        suburb: body.datosFiscales.colonia,
        postalCode: body.datosFiscales.codigoPostal,
        city: body.datosFiscales.poblacion,
        contry: body.datosFiscales.pais,
        region: body.datosFiscales.region,
      },
      salesData: {
        contactName: body.datosVentas.nombreContacto,
        mobilePhone: body.datosVentas.telMovil,
        phone: body.datosVentas.telFijo,
        phone2: body.datosVentas.telFijo2,
        ext: body.datosVentas.ext,
        ext2: body.datosVentas.ext2,
        extFax: body.datosVentas.extFax,
        fax: body.datosVentas.fax,
        email: body.datosVentas.email,
        typeEmployee: body.datosVentas.empleadoDueno,
        exaTec: body.datosVentas.exatec,
        webPage: body.datosVentas.pagina
      },
      bankData: {
        bankCountry: body.datosBanco.paisBanco,
        bank: body.datosBanco.banco,
        clabe: body.datosBanco.clabe,
        headline: body.datosBanco.titularCuenta,
        controlKey: body.datosBanco.claveControl,
        currency: body.datosBanco.moneda,
        contact: body.datosBanco.contactoCobranza,
        phoneNum: body.datosBanco.telefono,
        email: body.datosBanco.email,
      },
      comments: {
        comment: body.comentarios.comentarios,
        tecTerms: body.comentarios.terminos,
        politicsPrivacy: body.comentarios.politicaPriv
      },
      user: {
        email: body.usuario.email,
        rfc: body.usuario.rfc
      },
      authorization: {
        authDate: body.autorizador.fechaAut,
        authorizator: body.autorizador.autorizador,
      },
      complementaryInfo: {
        paymentConditions: body.datosComprador.condicionesPago,
        studentGroup: body.datosComprador.grupoEstudiantil,
        comments: body.datosComprador.comentarios,
      },
      masterData:{
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
      },
      user: {
        rfc : body.usuario.rfc,
        email : body.usuario.email
      },
      authorization: {
        authDate: body.autorizador.fechaAut,
        authorizator: body.autorizador.autorizador 
      },
      creation: {
        createDate: new Date(Date.now()),
        creator: userEmail,
      },
      institutions: body.instituciones,
      input: body.datosFiscales.insumo,
      businessTurn: body.datosFiscales.giro,
      status: 'Aprobada',
      requestId: id,
      requestNumber: '',
    };

    const getRequestNumber = preVendorModel.findById(id).read(ReadPreference.NEAREST);
    getRequestNumber
    .then(preRegister => {
      data.requestNumber = preRegister.requestNumber;
      
    const newPreVendor = new vendorModel(data);
    newPreVendor.save()
      .then(newPreVendor => {
        preVendorModel.findByIdAndRemove(id)
        .then(newPreVendor2 => {

          const history = {
            requestId: newPreVendor2._id,
            updater: userEmail,
            updatedDate: new Date(Date.now()),  
            status: 'Aprobada',
            comments: '',
          }
    
          const traceHistory = new Trace(history)
          traceHistory.save()
          .then(trace => {
          })
          .catch(e => {        
          });
    
        })
        .catch(e =>{}
         );
        res.json(newPreVendor)
      })
      .catch(e => res.status(500).send(e)
      );

    })
    .catch(e => {  res.status(500).send(e)      
    });
  })(req, res, next)
}

/*
** Actualizacion de la info complementaria del proveedor
** @proveedor
** @comprador
** @admin
*/
async function updateVendorInfo(req, res, next) {
  var id = req.params.id;
  var body = req.body;

  passport.authenticate('jwt', function (err, user) {
  var userEmail = user.email;
  const data = {
    fiscalData: {
      rfc: body.datosFiscales.rfc,
      personaType: body.datosFiscales.tipoPersona,
      curp: body.datosFiscales.curp,
      name: body.datosFiscales.nombre,
      lastName1: body.datosFiscales.apellidoP,
      lastName2: body.datosFiscales.apellidoM,
      street: body.datosFiscales.calle,
      number: body.datosFiscales.numero,
      suburb: body.datosFiscales.colonia,
      postalCode: body.datosFiscales.codigoPostal,
      city: body.datosFiscales.poblacion,
      contry: body.datosFiscales.pais,
      region: body.datosFiscales.region,
    },
    salesData: {
      contactName: body.datosVentas.nombreContacto,
      mobilePhone: body.datosVentas.telMovil,
      phone: body.datosVentas.telFijo,
      phone2: body.datosVentas.telFijo2,
      ext: body.datosVentas.ext,
      ext2: body.datosVentas.ext2,
      extFax: body.datosVentas.extFax,
      fax: body.datosVentas.fax,
      email: body.datosVentas.email,
      typeEmployee: body.datosVentas.empleadoDueno,
      exaTec: body.datosVentas.exatec,
      webPage: body.datosVentas.pagina
    },
    bankData: {
      bankCountry: body.datosBanco.paisBanco,
      bank: body.datosBanco.banco,
      clabe: body.datosBanco.clabe,
      headline: body.datosBanco.titularCuenta,
      controlKey: body.datosBanco.claveControl,
      currency: body.datosBanco.moneda,
      contact: body.datosBanco.contactoCobranza,
      phoneNum: body.datosBanco.telefono,
      email: body.datosBanco.email,
    },
    comments: {
      comment: body.comentarios.comentarios,
      tecTerms: body.comentarios.terminos,
      politicsPrivacy: body.comentarios.politicaPriv
    },
    institutions: body.instituciones,
    input: body.datosFiscales.insumo,
    businessTurn: body.datosFiscales.giro,
    rejectComments : '',
    status: 'Actualizada'
  };
  const docquery = preVendorModel.findByIdAndUpdate(id, data).read(ReadPreference.NEAREST);
    docquery
    .exec()
    .then(newPreVendor => {

      const history = {
        requestId: newPreVendor._id,
        updater: userEmail,
        updatedDate: new Date(Date.now()),  
        status: 'Actualizada',
        comments: '',
      }

      const traceHistory = new Trace(history)
      traceHistory.save()
      .then(trace => {
      })
      .catch(e => {        
      });

       res.json(newPreVendor)

    })
    .catch(e => res.status(500).send(e));
  })(req, res, next)
}
/*
** Rechazar solicitud de pre registro
** @comprador
** @admin
*/
async function vendorRejection(req, res, next) {
  var id = req.params.id;
  var body = res;
  var reason = req.query;
  const data = {
    status: 'Rechazada',
    rejectComments : reason.reason
  };
  passport.authenticate('jwt', function (err, user) {
    var userEmail = user.email;

  const docquery = preVendorModel.findByIdAndUpdate(id, data).read(ReadPreference.NEAREST);
    docquery
    .exec()
    .then(newPreVendor => {

      const history = {
        requestId: newPreVendor._id,
        updater: userEmail,
        updatedDate: new Date(Date.now()),  
        status: 'Rechazada',
        comments: reason.reason,
      }

      const traceHistory = new Trace(history)
      traceHistory.save()
      .then(trace => {
      })
      .catch(e => {        
      });

       res.json(newPreVendor)

    })
    .catch(e => res.status(500).send(e));
  })(req, res, next)

  var updatePreRegister = await preVendorModel.findByIdAndUpdate(id, data).read(ReadPreference.NEAREST);
  var updated = await preVendorModel.findById(id).read(ReadPreference.NEAREST);
  var email = await sendEmail.rejection(updated, reason);

  return updated
}

/*
** Rechazar solicitud de pre registro
** @admin
*/
async function adminRejection(req, res, next) {
  var id = req.params.id;
  var body = res;
  var reason = req.query;
  const data = {
    status: 'Rechazada',
    rejectComments : reason.reason
  };

  passport.authenticate('jwt', function (err, user) {
    var userEmail = user.email;

  const docquery = preVendorModel.findByIdAndUpdate(id, data).read(ReadPreference.NEAREST);
    docquery
    .exec()
    .then(newPreVendor => {

      const history = {
        requestId: newPreVendor._id,
        updater: userEmail,
        updatedDate: new Date(Date.now()),  
        status: 'Rechazada',
        comments: reason.reason,
      }

      const traceHistory = new Trace(history)
      traceHistory.save()
      .then(trace => {
      })
      .catch(e => {        
      });

       res.json(newPreVendor)

    })
    .catch(e => res.status(500).send(e));
  })(req, res, next)

  var updatePreRegister = await preVendorModel.findByIdAndUpdate(id, data).read(ReadPreference.NEAREST);
  var updated = await preVendorModel.findById(id).read(ReadPreference.NEAREST);
  var email = await sendEmail.rejection(updated, reason);
  
  return updated

}

/*
** Pre autorizacón pre registro
** @comprador
** @admin
*/
async function vendorPreAuthorization(req, res, next) {

  passport.authenticate('jwt', function (err, user) {
    var id = req.params.id;
    var body = req.body;
    var userEmail = user.email;

    const data = {
      status: 'Pre Aprobada',
      authorization: {
        authDate: new Date(Date.now()),
        authorizator: user.email
      },
      complementaryInfo: {
        paymentConditions: body.datosComprador.condicionesPago,
        studentGroup: body.datosComprador.grupoEstudiantil,
        comments: body.datosComprador.comentarios,
      },
      rejectComments : '',
    };
    var updatePreRegister = preVendorModel.findByIdAndUpdate(id, data).read(ReadPreference.NEAREST);
    var updated = preVendorModel.findById(id).read(ReadPreference.NEAREST);
    updatePreRegister
      .exec()
      .then(preVendors => {

        const history = {
          requestId: preVendors._id,
          updater: userEmail,
          updatedDate: new Date(Date.now()),  
          status: 'Pre Aprobada',
          comments: '',
        }
  
        const traceHistory = new Trace(history)
        traceHistory.save()
        .then(trace => {
          if (preVendors.comments.tecTerms == false){
          sendEmail.preAprobado(preVendors);
          }
        })
        .catch(e => {        
        });
  
        res.status(200).json(preVendors);
      })
      .catch(error => res.status(500).send(error));
  })(req, res, next)

}