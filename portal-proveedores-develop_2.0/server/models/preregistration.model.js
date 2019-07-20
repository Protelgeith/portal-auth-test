const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const userModel = require('./vendor-info.model')

const Schema = mongoose.Schema;

const preRegistrationSchema = new Schema({
    fiscalData: {
      rfc: {
        type: String,
        index: true,
        unique: true,
        required: false,
        validate: {
          isAsync: true,
          validator: function(v, cb) {
            userModel.find({'fiscalData.rfc': v}, function(err, docs ){
               cb(docs.length == 0);
            });
          },
          message: 'El RFC ya esta registrado'
       },
      },
      personaType: String,
      curp: String,
      name: String,
      lastName1: String,
      lastName2: String,
      street: String,
      number: String,
      suburb: String,
      postalCode: String,
      city: String,
      contry: String,
      region: String,
    },
    salesData: {
      contactName: String,
      mobilePhone: String,
      phone: String,
      phone2: String,
      ext: String,
      ext2: String,
      extFax: String,
      fax: String,
      email: {
        type: String,
        index: true,
        unique: true,
        required: false,
        validate: {
          isAsync: true,
          validator: function(v, cb) {
            userModel.find({'salesData.email': v}, function(err, docs ){
               cb(docs.length == 0);
            });
          },
          message: 'El email ya esta registrado'
        }
      },
      typeEmployee: String,
      exaTec: String,
      webPage: String
    },
    bankData: {
      bankCountry : String,
      bank: String,
      clabe: String,
      headline: String,
      controlKey: String,
      currency: String,
      contact: String,
      phoneNum: String,
      email: String,
    },
    user: {
      rfc: {
        type: String,
        index: true,
        unique: true,
        required: true,
        validate: {
          isAsync: true,
          validator: function(v, cb) {
            preRegistration.find({'user.rfc': v}, function(err, docs){
               cb(docs.length == 0);
            });
          },
          message: 'Proveedor ya tiene una solicitud activa'
        }
      },
      email: {
        type: String,
        index: true,
        unique: true,
        required: true,
        validate: {
          isAsync: true,
          validator: function(v, cb) {
            preRegistration.find({'user.email': v}, function(err, docs){
               cb(docs.length == 0);
            });
          },
          message: 'Proveedor ya tiene una solicitud activa'
        }
      }
    },
    comments: {
      comment:  String,
      tecTerms: Boolean,
      politicsPrivacy: Boolean
    },
    complementaryInfo: {
      paymentConditions: String,
      studentGroup: String,
      comments: String
    },
    masterData: {
      accountGroup: String,
      conceptBus: String,
      associateAcount: String,
      treasuryGroup: String,
      society: String,
      comForm: String,
      singleEntry: String,
      verifyFac: String,
      salesOrg: String,
      language: String,
      retentionSing01: String,
      retentionType01: String,
      subject01: String,
      branch: String,
      paymentWay: String,
      retentionSing02: String,
      retentionType02: String,
      subject02: String,
    },
    authorization: {
      authDate : Date,
      authorizator: String 
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    institutions: [String],
    input: [String],
    businessTurn: [String],
    status: { type: String, default: 'Solicitada' },
    requestNumber: Number,
    rejectComments: String,

}, {
    versionKey: false,
    collection: 'preRegistration'
});

preRegistrationSchema.plugin(AutoIncrement, { inc_field: 'requestNumber' });
const preRegistration = mongoose.model('preRegistration', preRegistrationSchema);

module.exports = preRegistration;