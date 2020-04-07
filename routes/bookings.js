const express = require('express');
const router = express.Router();

const { addBooking, deleteBooking, getBookings } = require('../controllers/bookings')

router.all('/', (req, res) => {
    return res.status('400').json({ error: 'invalid path' });
});

router.post('/add-booking', (req, res, next) => {
   let params = req.body;
    if (!params.bookedBy || !params.bookedFor || !params.date || !params.startTime || !params.endTime) {
        return res.status(400).json({ error: 'missing any of the following: bookedBy, bookedFor, date, startTime, endTime' });
    }
    addBooking(params)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ error: 'cannot query' });
        });
});

router.delete('/delete-booking', (req, res, next) => {
    let params = req.body;
     if (!params.id) {
         return res.status(400).json({ error: 'missing booking ID' });
     }
     deleteBooking(params.id)
         .then((data) => {
             res.status(200).json(data);
         })
         .catch((err) => {
             res.status(400).json({ error: 'cannot query' });
         });
 });

router.post('/get-bookings', (req, res, next) => {
    let params = req.body;
     if (!params.email || !params.date) {
         return res.status(400).json({ error: 'missing any of the following: email, date' });
     }
     getBookings(params.email, params.date, params.hasBooked)
         .then((data) => {
             res.status(200).json(data);
         })
         .catch((err) => {
             res.status(400).json({ error: 'cannot query' });
         });
});

module.exports = router;