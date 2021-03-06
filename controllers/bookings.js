const Booking = require('../models/bookings');
const Slot = require('../models/slots');

let addBooking = (booking) => {
    let errResp;
    return Slot.findOne({ 
            email: booking.bookedFor, 
            date: booking.date,
            startTime: booking.startTime, 
            endTime: booking.endTime 
        })
        .then((result) => {
            console.log(result);
            if (!result) {
                errResp = {
                    status: false,
                    message: "Slot does not exist"
                };
                return true;
            }
            if (result._id && result.isBooked === true) {
                errResp = {
                    status: false,
                    message: "Cannot book slot"
                };
                return true;
            }
            return Slot.findOneAndUpdate(
                { _id: result._id },
                { $set: { isBooked: true } },
                { new: true }
            );
        })
        .then((result) => {
            if (errResp) {
                return errResp;
            }
            let bookingObj = new Booking({
                date: booking.date,
                slotId: result._id,
                description: booking.description || null,
                startTime: booking.startTime,
                endTime: booking.endTime,
                bookedBy: booking.bookedBy,
                bookedFor: booking.bookedFor,
                createdAt: new Date().toISOString()
            });
            return bookingObj.save();
        })
        .then((data) => {
            if (errResp) {
                return errResp;
            }
            return {
                status: true,
                message: "Booking successful",
                data
            };
        })
        .catch((err) => {
            console.log(err);
            return err;
        })
};

let deleteBooking = (id) => {
    let errResp;
    return Booking.findOneAndDelete({ _id: id })
        .then((result) => {
            if (!result) {
                errResp = {
                    status: false,
                    message: "Booking does not exist"
                };
                return true;
            }
            return Slot.findOneAndUpdate(
                { _id: result.slotId },
                { $set: { isBooked: false } }
            );
        })
        .then(() => {
            if (errResp) {
                return errResp;
            }
            return {
                status: true,
                message: "Booking deleted successfully"
            };
        })
        .catch((err) => {
            console.log(err);
            return err;
        })
};

let getBookings = (email, date, hasBooked) => {
    let query;
    if (hasBooked === true) {
        query = { 
            bookedBy: email, 
            date: new Date(date) 
        };
    } else {
        query = { 
            bookedFor: email, 
            date: new Date(date) 
        };
    }
    return Booking.find(query)
        .then((result) => {
            if (!result instanceof Array) {
                result = [result];
            }
            return {
                status: true,
                message: `${result.length} bookings found`,
                data: result
            };
        })
        .catch((err) => {
            console.log(err);
            return err;
        });
}

module.exports = {
   addBooking,
   deleteBooking,
   getBookings
};