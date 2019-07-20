const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId

const settingsSchema = new Schema({
    proveedor: {
        type: Number,
        default: 15
    },
    comprador: {
        type: Number,
        default: 15
    },
}, {
    versionKey: false,
    collection: 'settings'
});

const settings = mongoose.model('settings', settingsSchema);

module.exports = settings;