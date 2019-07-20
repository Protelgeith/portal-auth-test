const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const Model = require('../models/user.model');
const Settings = require('../models/settings.model');
const ReadPreference = require('mongodb').ReadPreference;
const SendEmail = require("../helpers/email");
const sendEmail = new SendEmail();

module.exports = {
  generateToken,
  confirmAccount,
  resetPassword,
  sendResetPassword,
  refreshToken,
  getSettings,
  updateSettings,
}


function generateToken(user, res) {
  const email = user.email;
  let expirationTime;

  return new Promise((resolve, reject) => {

        Model.findOne({
          'email': email
        }).exec()
          .then(user => {
            let rol = user.rol.toString();
            const docquery = Settings.find({}, rol).read(ReadPreference.NEAREST);
            let payload = user.toJSON();
            docquery
              .exec()
              .then(userRol => {
                if (rol == 'comprador') {
                  expirationTime = userRol[0].comprador;
                  payload.expTime = expirationTime;
                  if (expirationTime == 0){
                    if (user.activeUser == true && user.isVerified == true) {
                      resolve(jwt.sign(payload, config.jwtSecret))
                    } else {
                      reject('Contactar al administrador')
                    }
                  } 
                }
                else if (rol == 'admin') {
                  if (user.activeUser == true && user.isVerified == true) {
                    resolve(jwt.sign(payload, config.jwtSecret))
                  } else {
                    reject('Contactar al administrador')
                  }
                }  
                else {
                  expirationTime = userRol[0].proveedor;
                  payload.expTime = expirationTime;
                  if (expirationTime == 0){
                    if (user.activeUser == true && user.isVerified == true) {
                      resolve(jwt.sign(payload, config.jwtSecret))
                    } else {
                      reject('Contactar al administrador')
                    }
                  }  
                }
                expirationTime = expirationTime.toString() + 'm';

                if (user.activeUser == true && user.isVerified == true) {
                  resolve(jwt.sign(payload, config.jwtSecret, { expiresIn: '1440m' }))
                } else {
                  reject('Contactar al administrador')
                }

              })
              .catch(error => { console.log(error),res.status(500).json(error)});
          })
          .catch(error => { res.status(500).json(error)});
  })
}

function confirmAccount(req, res) {

  let _id = req.params.id;
  const data = {
    isVerified: true
  }

  const docquery = Model.findByIdAndUpdate(_id, data).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(userUpdated => {
      res.status(200).json('El usuario ha sido confirmado');
    })
    .catch(e => { res.status(500).send(e); });

}

function sendResetPassword(req, res) {

  let email = req.params.email;

  const docquery = Model.findOne({ 'email': email }).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(user => {

      const payload = {
        id: user._id,
        email: email
      }

      let resetToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '15m' });
      sendEmail.passwordReset(user, resetToken);
      res.status(200).json(resetToken);
    })
    .catch(error => res.status(500).send('Correo no valido'));

}

function resetPassword(req, res) {

  var token = req.params.token;
  var body = req.body;

  var data = {
    password: body.password = bcrypt.hashSync(body.password, 10)
  }

  try {
    let decoded = jwt.verify(token, config.jwtSecret);
    var _id = decoded.id;
    const docquery = Model.findByIdAndUpdate(_id, data).read(ReadPreference.NEAREST);
    docquery
      .exec()
      .then(userUpdated => {
        res.status(200).json({ response: 'Se ha cambiado la contraseña' });
      })
      .catch(e => { res.status(500).send(e); });
  } catch (err) {
    res.status(403).send({ response: err.message })
  }

}

function refreshToken(req, res) {

  let body = req.body;
  let user = {
    rfc : body.rfc
  }
  generateToken(user, res)
  .then(tokenUpdated => {
    res.status(200).json({tokenUpdated});
  })
  .catch(e => { res.status(500).send(e); });
}

function getSettings(req, res) {

  const docquery = Settings.find({}).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(settings => {
      res.status(200).json(settings);
    })
    .catch(error => res.status(500).send(error));

}

function updateSettings(req, res) {

  let id = req.params.id;
  let body = req.body;
  let data = {
    proveedor : body.proveedor,
    comprador : body.comprador,
  }
   const docquery = Settings.findByIdAndUpdate(id, data).read(ReadPreference.NEAREST);
    docquery
      .exec()
      .then(updatedSettings => {
        res.status(200).json({ updatedSettings });
      })
      .catch(e => { res.status(500).send(e); });

}