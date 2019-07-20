const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId

const traceHistorySchema = new Schema({
    requestId: ObjectId,
    updater: String,
    updatedDate: Date,  
    status: String,
    comments: String,
}, {
    versionKey: false,
    collection: 'traceHistory'
});

const traceHistory = mongoose.model('traceHistory', traceHistorySchema);

module.exports = traceHistory;