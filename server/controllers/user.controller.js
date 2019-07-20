const bcrypt = require('bcrypt');
const Joi = require('joi');
const Model = require('../models/user.model');
const Trace = require('../models/trace-history.model');
const ReadPreference = require('mongodb').ReadPreference;
const SendEmail = require("../helpers/email");
const passport = require('passport');
const password = require('secure-random-password');
const sendEmail = new SendEmail();

const userSchema = Joi.object({
  password: Joi.string().required(),
  repeatPassword: Joi.string().required().valid(Joi.ref('password'))
})

module.exports = {
  insert,
  insertUser,
  editUser,
  deleteUser
}

/*
** Funcion para insertar nuevo user
*/

function insert(req, res, next) {
  var body = req.body;
  body.hashedPassword = bcrypt.hashSync(body.password, 10);
  var permisos;
  switch (body.rol) {
    case 'comprador':
      permisos = [
        [{
          alta: true,
          actualiza: true,
          visualiza: true,
        }],
        [{
          alta: true,
          actualiza: true,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: true,
        }],
        [{
          alta: true,
          actualiza: true,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: false,
        }]
      ]
      break;

    case 'admin':
      permisos = [
        [{
          alta: false,
          actualiza: true,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: true,
        }],
        [{
          alta: true,
          actualiza: true,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: true,
        }],
        [{
          alta: true,
          actualiza: true,
          visualiza: true,
        }],
        [{
          alta: true,
          actualiza: true,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: true,
        }],
        [{
          alta: true,
          actualiza: true,
          visualiza: true,
        }]
      ]
      break;

    default:
      permisos = [
        [{
          alta: true,
          actualiza: true,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: false,
        }],
        [{
          alta: true,
          actualiza: true,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: false,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: false,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: false,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: false,
        }]
      ]
      break;

  }
  const data = {
    rfc: body.rfc,
    email: body.email,
    payroll: body.nomina,
    password: body.hashedPassword,
    rol: body.rol,
    activeUser: true,
    permissions: permisos,
  }

  if (req.headers.authorization != '') {
    passport.authenticate('jwt', function (err, user) {
      
      userEmail = user.email;
      userRFC = user.rfc;
      const newPreVendor = new Model(data);
      newPreVendor.save()
        .then(newPreVendor => {
          sendEmail.authorization(newPreVendor);

          const history = {
            requestId: newPreVendor._id,
            updater: userEmail,
            updatedDate: new Date(Date.now()),
            status: 'Creado',
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
  else {
    const newPreVendor = new Model(data);
    newPreVendor.save()
      .then(newPreVendor => {
        sendEmail.authorization(newPreVendor);

        const history = {
          requestId: newPreVendor._id,
          updater: '',
          updatedDate: new Date(Date.now()),
          status: 'Auto Creado',
        }
        const traceHistory = new Trace(history)

        traceHistory.save()
          .then(trace => {
          })
          .catch(e => {
          });

        res.json(newPreVendor)
        //console.log(data);
      })
      .catch(e => res.status(500).send(e));
  }
}

/*
** Funcion para insertar nuevo user rapido
*/

function insertUser(req, res, next) {
  var body = req.body;
  let randPassword = password.randomPassword({ characters: [password.lower, password.upper, password.digits] })
  let permisos = [
        [{
          alta: true,
          actualiza: true,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: false,
        }],
        [{
          alta: true,
          actualiza: true,
          visualiza: true,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: false,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: false,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: false,
        }],
        [{
          alta: false,
          actualiza: false,
          visualiza: false,
        }]
      ]

  const data = {
    rfc: body.rfc,
    email: randPassword + '@tec.com',
    payroll: body.nomina,
    password: bcrypt.hashSync(randPassword, 10),
    rol: 'proveedor',
    activeUser: true,
    fullForm: true,
    isVerified: true,
    permissions: permisos,
  }

  if (req.headers.authorization != '') {
    passport.authenticate('jwt', function (err, user) {
      
      userEmail = user.email;
      userRFC = user.rfc;
      const newPreVendor = new Model(data);
      newPreVendor.save()
        .then(newPreVendor => {
          sendEmail.authorization(newPreVendor);

          const history = {
            requestId: newPreVendor._id,
            updater: userEmail,
            updatedDate: new Date(Date.now()),
            status: 'Creado',
          }
          const traceHistory = new Trace(history)

          traceHistory.save()
            .then(trace => {
            })
            .catch(e => {
            });
          newPreVendor.password = randPassword;
          res.json(newPreVendor)
        })
        .catch(e => res.status(500).send(e));
    })(req, res, next)
  }
  else {
    const newPreVendor = new Model(data);
    newPreVendor.save()
      .then(newPreVendor => {
        sendEmail.authorization(newPreVendor);

        const history = {
          requestId: newPreVendor._id,
          updater: '',
          updatedDate: new Date(Date.now()),
          status: 'Auto Creado',
        }
        const traceHistory = new Trace(history)

        traceHistory.save()
          .then(trace => {
          })
          .catch(e => {
          });

        res.json(newPreVendor)
        //console.log(data);
      })
      .catch(e => res.status(500).send(e));
  }
}


function editUser(req, res, next) {

  const id = req.params.id;
  const body = req.body;

  const data = {
    rol: req.body.rol,
    activeUser: req.body.activeUser,
    permissions: [
      [{
        alta: body.permisos[0][0].alta,
        actualiza: body.permisos[0][0].actualiza,
        visualiza: body.permisos[0][0].visualiza
      }],
      [{
        alta: body.permisos[1][0].alta,
        actualiza: body.permisos[1][0].actualiza,
        visualiza: body.permisos[1][0].visualiza
      }],
      [{
        alta: body.permisos[2][0].alta,
        actualiza: body.permisos[2][0].actualiza,
        visualiza: body.permisos[2][0].visualiza
      }],
      [{
        alta: body.permisos[3][0].alta,
        actualiza: body.permisos[3][0].actualiza,
        visualiza: body.permisos[3][0].visualiza
      }],
      [{
        alta: body.permisos[4][0].alta,
        actualiza: body.permisos[4][0].actualiza,
        visualiza: body.permisos[4][0].visualiza
      }],
      [{
        alta: body.permisos[5][0].alta,
        actualiza: body.permisos[5][0].actualiza,
        visualiza: body.permisos[5][0].visualiza
      }],
      [{
        alta: body.permisos[6][0].alta,
        actualiza: body.permisos[6][0].actualiza,
        visualiza: body.permisos[6][0].visualiza
      }],
      [{
        alta: body.permisos[7][0].alta,
        actualiza: body.permisos[7][0].actualiza,
        visualiza: body.permisos[7][0].visualiza
      }]
    ]
  }

  passport.authenticate('jwt', function (err, user) {

    userEmail = user.email;
    userRFC = user.rfc;

    const docquery = Model.findByIdAndUpdate(id, data).read(ReadPreference.NEAREST);
    docquery
      .exec()
      .then(usuario => {
        const history = {
          requestId: usuario._id,
          updater: userEmail,
          updatedDate: new Date(Date.now()),
          status: 'Actualizado',
        }
        const traceHistory = new Trace(history)

        traceHistory.save()
          .then(trace => {
          })
          .catch(e => {
          });

        res.status(200).json('El usuario ha sido actualizado');
      })
      .catch(error => {
        res.status(500).send(error);
        return;
      });

  })(req, res, next)
}

function deleteUser(req, res) {
  const id = req.params.id;
  const docquery = Model.findByIdAndDelete({ '_id': id }).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(usuario => {
      res.status(200).json('El usuario ha sido eliminado');
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
}
