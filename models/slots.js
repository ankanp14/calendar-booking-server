const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let SlotSchema = new Schema({
    email: {
        type: String,
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
    isBooked: {
        type: Boolean
    },
    createdAt: {
        type: Schema.Types.Date,
        required: true
    }
});

module.exports = mongoose.model('slots', SlotSchema);