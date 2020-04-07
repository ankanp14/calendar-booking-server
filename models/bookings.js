const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BookingSchema = new Schema({
    date: {
        type: Schema.Types.Date,
        required: true
    },
    slotId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    description: {
        type: String
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    bookedBy: {
        type: String,
        required: true
    },
    bookedFor: {
        type: String,
        required: true
    },
    createdAt: {
        type: Schema.Types.Date,
        required: true
    }
});

module.exports = mongoose.model('bookings', BookingSchema);