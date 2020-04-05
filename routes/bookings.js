let express = require('express');
let router = express.Router();

router.all('/', (req, res) => {
    return res.status('400').json({ error: 'invalid path' });
});

router.post('/addSlot', (req, res, next) => {
    /*
        userId: <GUID>
        slots: [{ start: "12:00", stop: "13:00" }, ...]
        date: <date string>
    */
   let params = req.body;
    if (!params.userId || !params.slots || !params.date) {
        return res.status(400).json({ error: 'missing any of the following: userId, slots, date' });
    }
    if (!(params.slots instanceof Array)) {
        return res.status(400).json({ error: 'slots should be a list' });
    }
});

module.exports = router;