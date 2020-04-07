const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const config = require('../config');

let token;
let bookingId;
let connObj;

describe('Get token and add slots before all other tests', () => {
    //create db connection
    before((done) => {
        mongoose.connect(config.testDbUrl, { dbName: config.testDbName, useNewUrlParser: true, useUnifiedTopology: true })
            .then((conn) => {
                connObj = conn.connection;
                return Promise.all([
                    conn.connection.db.dropCollection('bookings'),
                    conn.connection.db.dropCollection('slots')
                ]);
            })
            .then(() => done())
            .catch((err) => done());// throws error if the collection does not exist
    });
    
    it('get token for valid user', (done) => {
      chai.request(config.url)
          .post('/login')
          .send({
              "email": "ankanpathak1@gmail.com",
              "password": "test123"
          })
          .end((err, res) => {
              expect(err).to.be.null;
              expect(res.body.status).to.be.true;
              expect(res.body.message).to.be.equal("verified");
              expect(res.body.userId).to.be.not.null;
              expect(res.body.token).to.be.not.null;
              token = res.body.token;
              expect(res).to.have.status('200');
              done();
          });
    });

    it('should be able to add slots', (done) => {
        chai.request(config.url)
        .post('/add-slots')
        .send({
            "email": "ankanpathak1@gmail.com",
            "date": "2020-04-07",
            "slots": [
                {
                    "startTime": "10:00",
                    "endTime": "11:00"
                },
                {
                    "startTime": "12:00",
                    "endTime": "13:00"
                },
                {
                    "startTime": "15:00",
                    "endTime": "16:00"
                },
                {
                    "startTime": "16:00",
                    "endTime": "17:00"
                }
            ]
        })
        .set({
            "Authorization": "Bearer " + token
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status('200');
            expect(res.body.status).to.be.true;
            expect(res.body.data).to.not.be.null;
            res.body.data.forEach((elm) => {
                expect(elm).to.have.keys('_id', 'email', 'createdAt', "startTime", "endTime", "isBooked", "date", "__v");
            });
            done();
        });
    });
});

describe('POST /add-booking', () => {
    it('should be able to save a booking', (done) => {
        chai.request(config.url)
        .post('/add-booking')
        .send({
            "bookedBy": "john.smith@gmail.com",
            "bookedFor": "ankanpathak1@gmail.com",
            "description": "Discussion api security",
            "date": "2020-04-07",
            "startTime": "15:00",
            "endTime": "16:00"
        })
        .set({
            "Authorization": "Bearer " + token
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status('200');
            expect(res.body.status).to.be.true;
            expect(res.body.data).to.not.be.null;
            expect(res.body.data).to.have.keys(
                '_id',
                'date',
                'slotId',
                'description',
                'createdAt',
                "startTime",
                "endTime",
                "bookedBy",
                "bookedFor",
                "__v"
            );
            bookingId = res.body.data._id;
            done();
        });
    });
    
    it('should be not be able to save a duplicate booking', (done) => {
        chai.request(config.url)
        .post('/add-booking')
        .send({
            "bookedBy": "john.smith@gmail.com",
            "bookedFor": "ankanpathak1@gmail.com",
            "description": "Discussion api security",
            "date": "2020-04-07",
            "startTime": "15:00",
            "endTime": "16:00"
        })
        .set({
            "Authorization": "Bearer " + token
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status('200');
            expect(res.body.status).to.be.false;
            expect(res.body.data).to.be.undefined;
            done();
        });
    });

    it('should be not be able to book a slot that does not exist', (done) => {
        chai.request(config.url)
        .post('/add-booking')
        .send({
            "bookedBy": "john.smith@gmail.com",
            "bookedFor": "ankanpathak1@gmail.com",
            "description": "Discussion api security",
            "date": "2020-04-07",
            "startTime": "19:00",
            "endTime": "20:00"
        })
        .set({
            "Authorization": "Bearer " + token
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status('200');
            expect(res.body.status).to.be.false;
            expect(res.body.data).to.be.undefined;
            done();
        });
    });
});

describe('POST /get-bookings', () => {
    it('should be able to fetch bookings', (done) => {
        chai.request(config.url)
        .post('/get-bookings')
        .send({
            "email": "john.smith@gmail.com",
            "date": "2020-04-07"
        })
        .set({
            "Authorization": "Bearer " + token
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status('200');
            expect(res.body.status).to.be.true;
            expect(res.body.data).to.not.be.empty;
            res.body.data.forEach((elm) => {
                expect(elm).to.have.keys(
                    '_id',
                    'date',
                    'slotId',
                    'description',
                    'createdAt',
                    "startTime",
                    "endTime",
                    "bookedBy",
                    "bookedFor",
                    "__v"
                );
            });
            bookingId = res.body.data[0]._id;
            done();
        });
    });
    
    it('should get empty list for no bookings found', (done) => {
        chai.request(config.url)
        .post('/get-bookings')
        .send({
            "email": "john.smith@gmail.com",
            "date": "2020-01-01"
        })
        .set({
            "Authorization": "Bearer " + token
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status('200');
            expect(res.body.status).to.be.true;
            expect(res.body.data).to.be.empty;
            done();
        });
    });
});

describe('DELETE /delete-booking', () => {
    it('should be able to delete a booking', (done) => {
        chai.request(config.url)
        .delete('/delete-booking')
        .send({
            "id": bookingId
        })
        .set({
            "Authorization": "Bearer " + token
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status('200');
            expect(res.body.status).to.be.true;
            done();
        });
    });
    
    it('should not be able to delete a booking that does not exist', (done) => {
        chai.request(config.url)
        .delete('/delete-booking')
        .send({
            "id": bookingId
        })
        .set({
            "Authorization": "Bearer " + token
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status('200');
            expect(res.body.status).to.be.false;
            done();
        });
    });

    //close db connection after tests complete
    after(() => connObj.close());
});