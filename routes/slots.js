const express = require('express');
const router = express.Router();

const { addSlots, deleteSlot, getSlots } = require('../controllers/slots')

router.all('/', (req, res) => {
    return res.status('400').json({ error: 'invalid path' });
});

let validateSlots = (slots) => {
    let isValid = true;
    slots.forEach(elm => {
        if (!elm) {
            isValid = false;
        } else if (!elm.startTime || typeof elm.startTime !== "string") {
            isValid = false;
        } else if (!elm.endTime || typeof elm.endTime !== "string") {
            isValid = false;
        }
    });
    return isValid;
};

router.post('/add-slots', (req, res, next) => {
   let params = req.body;
    if (!params.userId || !params.date || !params.slots) {
        return res.status(400).json({ error: 'missing any of the following: userId, date, slots' });
    }
    if (!params.slots instanceof Array) {
        return res.status(400).json({ error: 'slots should be an array' });
    }
    if (!validateSlots(params.slots)) {
        return res.status(400).json({ error: 'one or more invalid slots' });
    }
    addSlots(params.userId, params.date, params.slots)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ error: 'cannot query' });
        });
});

router.delete('/delete-slot', (req, res, next) => {
    let params = req.body;
     if (!params.id) {
         return res.status(400).json({ error: 'missing slot ID' });
     }
     deleteSlot(params.id)
         .then((data) => {
             res.status(200).json(data);
         })
         .catch((err) => {
             res.status(400).json({ error: 'cannot query' });
         });
 });

router.post('/get-slots', (req, res, next) => {
    let params = req.body;
     if (!params.userId || !params.date) {
         return res.status(400).json({ error: 'missing any of the following: userId, date' });
     }
     getSlots(params.userId, params.date)
         .then((data) => {
             res.status(200).json(data);
         })
         .catch((err) => {
             res.status(400).json({ error: 'cannot query' });
         });
});

module.exports = router;