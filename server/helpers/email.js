const nodemailer = require('nodemailer');

const emailSettings = {
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  tls: {
    cipher:'SSLv3'
  },
  auth: {
      user: 'l99800006@servicios.itesm.mx', // generated ethereal user
      pass: 'eTge=0654' // generated ethereal password
  }
}

function sendEmail(data){
  var self = this;
}

/*
** Funcion envio de correo al compradores por nuevo pre-registro
** @comprador
** @admin
*/
sendEmail.prototype.newRequest = function (data){
  var rfc = data.fiscalData.rfc;
  var fecha = data.createdAt;
  nodemailer.createTestAccount((err) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(emailSettings);
    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Portal Proveedores" <l99800006@servicios.itesm.mx>',
      to: 'cristhian.estrada@itesm.mx',
      subject: 'Nuevo Proveedor Registrado',
      html: '<h2>Hola<h2><br>' +
            '<p>Se hizo un nuevo pre registro con el RFC: '+ rfc +'<br>'
    };
    // send mail with defined transport object
    console.log(mailOptions)
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      return nodemailer.getTestMessageUrl(info);
    });
  });
}

/*
** Funcion envio de correo al proveedor para que guarde su password
** @proveedor
*/
sendEmail.prototype.authorization = function (data){
  var email = data.email;
  var id = data._id;

  nodemailer.createTestAccount((err) => {
    let transporter = nodemailer.createTransport(emailSettings);
    let mailOptions = {
      from: '"Portal Proveedores" <l99800006@servicios.itesm.mx>',
      to: email,
      subject: 'Registro en Portal de Proveedores',
      html: '<h2>Hola<h2><br>' +
            '<p>Se realizo su registro como proveedor del tec<br>'+
            '<p>por favor entra a la siguente liga para confirmar su cuenta</p>' +
            '<p><a href="http://localhost:4200/auth/confirm-account/'+ id +'">Link</a></p>'

    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      return nodemailer.getTestMessageUrl(info);
    });
  });
}

/*
** Funcion envio de correo al proveedor tras ser rechaza su pre registro
** @proveedor
*/
sendEmail.prototype.rejection = function (updated, reason){
  var email = updated.user.email;
  nodemailer.createTestAccount((err) => {
    let transporter = nodemailer.createTransport(emailSettings);
    let mailOptions = {
      from: '"Portal Proveedores" <l99800006@servicios.itesm.mx>',
      to: email,
      subject: 'Proveedor Autorizado',
      html: '<h2>Hola<h2><br>' +
            '<p>Se ha rechazado su pre-registro como proveedor del TEC por el siguiente motivo: <br><br>'+
            '"' + reason.reason + '"' +
            '<p>Por favor de validar información y actualizar solicitud.</p>' 
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      return nodemailer.getTestMessageUrl(info);
    });
  });
}

/*
** Funcion envio de correo al para reestablecer contraseña
** @proveedor
*/
sendEmail.prototype.passwordReset = function (data, resetToken){

  var email = data.email;
  var token = resetToken;

  var id = data._id;
  nodemailer.createTestAccount((err) => {
    let transporter = nodemailer.createTransport(emailSettings);
    let mailOptions = {
      from: '"Portal Proveedores" <l99800006@servicios.itesm.mx>',
      to: email,
      subject: 'Reestablecer contraseña en Portal de Proveedores',
      html: '<h2>Hola<h2><br>' +
            '<p>Por favor entrar a la siguente liga para cambiar su contraseña</p>' +
            '<p><a href="http://localhost:4200/auth/reset-password/'+ token +'">Link</a></p>'

    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      return nodemailer.getTestMessageUrl(info);
    });
  });
}

/*
** Funcion envio de correo al pre aprobar solicitud
** @proveedor
*/
sendEmail.prototype.preAprobado = function (data){
  let email = data.user.email;
  let rfc = data.fiscalData.rfc;
  nodemailer.createTestAccount((err) => {
    let transporter = nodemailer.createTransport(emailSettings);
    let mailOptions = {
      from: '"Portal Proveedores" <l99800006@servicios.itesm.mx>',
      to: email,
      subject: 'Solicitud Pre Aprobada por Comprador.',
      html: '<h2>Hola<h2><br>' +
            '<p>Su solicitud con RFC: '+ rfc +' ha sido pre aprobada</p>' +
            '<p>Favor de ingresar al portal para llenar los datos faltantes.</p>' 

    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      return nodemailer.getTestMessageUrl(info);
    });
  });
}

module.exports = sendEmail;
