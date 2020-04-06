const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let SlotSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Schema.Types.Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    createdAt: {
        type: Schema.Types.Date,
        required: true
    }
});

module.exports = mongoose.model('slots', SlotSchema);