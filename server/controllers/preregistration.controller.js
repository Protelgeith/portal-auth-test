const Model = require('../models/preregistration.model');
const userInfo = require('../models/vendor-info.model');
const Trace = require('../models/trace-history.model');
const userModel = require('../models/user.model');
const ReadPreference = require('mongodb').ReadPreference;
const passport = require('passport');
const SendEmail = require("../helpers/email");
const sendEmail = new SendEmail();

module.exports = {
  getAllCandidates,
  getCandidate,
  getMyRegister,
  postCandidate,
  postCompleteCandidate,
  postWholeCandidate,
  deleteCandidate
}

function getAllCandidates(req, res, next) {
  const docquery = Model.find({}).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(preVendors => {
      res.status(200).json(preVendors);
    })
    .catch(error => res.status(500).send(error));
}

function getMyRegister(req, res, next) {
  const status = req.query.status;  
  passport.authenticate('jwt', function (err, user) {
    const rfc = user.rfc;
    if(status != 'Aprobada' ) {
      const docquery = Model.find({ 'user.rfc': rfc }).read(ReadPreference.NEAREST);
      docquery
        .exec()
        .then(preVendors => {
          res.status(200).json(preVendors);
        })
        .catch(error => res.status(500).send(error));
    } else {
      const docquery = userInfo.find({ 'fiscalData.rfc': rfc }).read(ReadPreference.NEAREST);
      docquery
        .exec()
        .then(preVendors => {
          res.status(200).json(preVendors);
        })
        .catch(error => res.status(500).send(error));
    }

  })(req, res, next);
}

function postWholeCandidate(req, res, next) {
  var body = req.body;
  passport.authenticate('jwt', async function (err, user) {
    //userEmail = user.email;
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
        email: body.datosVentas.email,
        rfc: userRFC,
      },
      institutions: body.instituciones,
      input: body.datosFiscales.insumo,
      businessTurn: body.datosFiscales.giro,
      status: 'Completada',
      requestNumber: '',
    };

    const newPreVendor = new Model(data);
    newPreVendor.save()
        .then(newPreVendor2 => {
          const history = {
            requestId: newPreVendor2._id,
            updater: '',
            updatedDate: new Date(Date.now()),  
            status: 'Completada',
            comments: '',
          }

          const docquery = userModel.find({'rfc' : userRFC}).read(ReadPreference.NEAREST);
          docquery
            .exec()
            .then(foundUser => {
              const email = {
                email: data.salesData.email
              }
              let updatedEmailUser = foundUser[0]._id;
              const docquery = userModel.findByIdAndUpdate(updatedEmailUser, email).read(ReadPreference.NEAREST);
              docquery
              .exec()
              .then(userEmail => {
                const traceHistory = new Trace(history)
                traceHistory.save()
                .then(trace => {
                })
                .catch(e => {});
              }
              )
              .catch(e => {});
            })
            .catch(e => {});

        res.json(newPreVendor)
      })
      .catch(e => res.status(500).send(e)
      );
  })(req, res, next)
}



function postCandidate(req, res, next) {
  var body = req.body;
  var userEmail; 
  var userRFC;

  passport.authenticate('jwt', function (err, user) {
    if (user.rol == 'proveedor' || user.rol == ''){
      userEmail = user.email;
      userRFC = user.rfc;
    }
    else {
      userEmail = body.datosVentas.email; 
      userRFC = body.datosFiscales.rfc;
    }
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
          bankCountry : body.datosBanco.paisBanco,
          bank:  body.datosBanco.banco,
          clabe:  body.datosBanco.clabe,
          headline: body.datosBanco.titularCuenta,
          controlKey: body.datosBanco.claveControl,
          currency: body.datosBanco.moneda,
          contact: body.datosBanco.contactoCobranza,
          phoneNum: body.datosBanco.telefono,
          email: body.datosBanco.email,
        },
        comments: {
          comment:  body.comentarios.comentarios,
          tecTerms: body.comentarios.terminos,
          politicsPrivacy: body.comentarios.politicaPriv
        },
        user: {
          email: userEmail,
          rfc: userRFC
        },
        institutions: body.instituciones,
        input: body.datosFiscales.insumo,
        businessTurn: body.datosFiscales.giro,
        status: 'Solicitada'
      };

  const newPreVendor = new Model(data);

  newPreVendor.save()
    .then(newPreVendor => {

      const history = {
        requestId: newPreVendor._id,
        updater: userEmail,
        updatedDate: new Date(Date.now()),  
        lastUpdatedDate: newPreVendor.lastUpdate,
        status: newPreVendor.status,
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
    .catch(e => res.status(500).send(e)
    );
  })(req, res, next)

}

function postCompleteCandidate(req, res, next) {

  var body = req.body;
  var id = req.params.id; 
  var userEmail; 
  var userRFC;
  
  passport.authenticate('jwt', function (err, user) {
    if (user.rol == 'proveedor' || user.rol == ''){
      userEmail = user.email;
      userRFC = user.rfc;
    }
    else {
      userEmail = body.datosVentas.email; 
      userRFC = body.datosFiscales.rfc;
    }
       const data = {
        bankData: {
          bankCountry : body.datosBanco.paisBanco,
          bank:  body.datosBanco.banco,
          clabe:  body.datosBanco.clabe,
          headline: body.datosBanco.titularCuenta,
          controlKey: body.datosBanco.claveControl,
          currency: body.datosBanco.moneda,
          contact: body.datosBanco.contactoCobranza,
          phoneNum: body.datosBanco.telefono,
          email: body.datosBanco.email,
        },
        comments: {
          comment:  body.comentarios.comentarios,
          tecTerms: body.comentarios.terminos,
          politicsPrivacy: body.comentarios.politicaPriv
        },
        user: {
          email: userEmail,
          rfc: userRFC
        },
        status : 'Completada'
      };

  const docquery = Model.findByIdAndUpdate(id, data).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(newPreVendor => {
      const history = {
        requestId: newPreVendor._id,
        updater: userEmail,
        updatedDate: new Date(Date.now()),  
        lastUpdatedDate: newPreVendor.lastUpdate,
        status: 'Completada',
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
    .catch(e => res.status(500).send(e)
    );
  })(req, res, next)

}


/*
** Funcion de pruebas para obtener todos los pre-registrados
** @dev
*/
function getAllCandidates(req, res, next) {
  const docquery = Model.find({}).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(preVendors => {
      res.status(200).json(preVendors);
    })
    .catch(error => res.status(500).send(error));
}

/*
** Funcion de pruebas para obtener 1 pre-registrado
** @dev
*/

function getCandidate(req, res, next) {
  const status = req.params.status;
  passport.authenticate('jwt', function (err, user) { 
    if (user.rol === 'proveedor' || user.rol === ''){
    const email = user.rfc
    const rfc = req.params.rfc

    if(status != 'Aprobada' ) {
      const docquery = Model.findOne({ 'user.rfc': email , 'fiscalData.rfc' : rfc}).read(ReadPreference.NEAREST);
      docquery
        .exec()
        .then(preVendors => {
          res.status(200).json(preVendors);
        })
        .catch(error => res.status(500).send(error));
    } else {
      const docquery = userInfo.findOne({'fiscalData.rfc' : rfc}).read(ReadPreference.NEAREST);
      docquery
        .exec()
        .then(preVendors => {
          res.status(200).json(preVendors);
        })
        .catch(error => res.status(500).send(error));
    }
   
    }
    else {
 
      const rfc = req.params.rfc;
      if (status != 'Aprobada'){
        docquery = Model.findOne({ 'fiscalData.rfc': rfc }).read(ReadPreference.NEAREST);
        docquery
        .exec()
        .then(preVendor => {
          res.status(200).json(preVendor);
        })
        .catch(error => res.status(500).send(error));
      }else {
        docquery = userInfo.findOne({ 'fiscalData.rfc': rfc }).read(ReadPreference.NEAREST);
        docquery
        .exec()
        .then(preVendor => {
          res.status(200).json(preVendor);
        })
        .catch(error => res.status(500).send(error));
      }
    }
  })(req, res, next);

}


/*
** Funcion de pruebas para borrar 1 pre-registrado
** @dev
*/
function deleteCandidate(req, res, next) {
  const rfc = req.params.rfc
  const docquery = Model.findOneAndDelete({ 'fiscalData.rfc': rfc }).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(preVendor => {
      res.status(200).json(preVendor);
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
}
