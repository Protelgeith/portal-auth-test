const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const masterDataSchema = new Schema({
  masterData : {
    accountGroup: {
            type: String,
            index: true,
            unique: true,
            required: true,
            validate: {
              isAsync: true,
              validator: function(v, cb) {
                masterData.find({'masterData.accountGroup': v}, function(err, docs ){
                   cb(docs.length == 0);
                });
              },
              message: 'El crupo de cuentas ya esta registrado'
          },
        },
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
    },
 {
    versionKey: false,
    collection: 'masterData'
  }
);

const masterData = mongoose.model('masterData', masterDataSchema);

module.exports = masterData;