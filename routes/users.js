const express = require('express');
const router = express.Router();

const { getUser, createUser, login } = require('../controllers/users')

router.all('/', (req, res) => {
    return res.status('400').json({ error: 'invalid path' });
});

router.post('/get-user', (req, res, next) => {
   let params = req.body;
    if (!params.email) {
        return res.status(400).json({ error: 'missing user email' });
    }
    getUser(params.email)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ error: 'cannot query' });
        });
});

router.post('/registration', (req, res, next) => {
    let params = req.body;
     if (!params.name || !params.email || !params.password) {
         return res.status(400).json({ error: 'missing any of the following: name, email, password' });
     }
     createUser(params.name, params.email, params.password)
         .then((data) => {
             res.status(200).json(data);
         })
         .catch((err) => {
             res.status(400).json({ error: 'cannot query' });
         });
});

router.post('/login', (req, res, next) => {
    let params = req.body;
     if (!params.email || !params.password) {
         return res.status(400).json({ error: 'missing any of the following: email, password' });
     }
     login(params.email, params.password)
         .then((data) => {
             res.status(200).json(data);
         })
         .catch((err) => {
             res.status(400).json({ error: 'cannot query' });
         });
});

module.exports = router;