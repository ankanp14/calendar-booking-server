const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const config = require('../config');

let token;
let slotId;
let connObj;

describe('Get token before all other tests', () => {
    //create db connection
    before((done) => {
        mongoose.connect(config.testDbUrl, { dbName: config.testDbName, useNewUrlParser: true, useUnifiedTopology: true })
            .then((conn) => {
                connObj = conn.connection;
                return conn.connection.db.dropCollection('slots');
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
});

describe('POST /add-slots', () => {
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
    
    it('should be not be able to add duplicate slots', (done) => {
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
            res.body.data.forEach((elm) => {
                expect(elm).to.not.have.keys('_id', 'email', 'createdAt', "startTime", "endTime", "isBooked", "date", "__v");
            });
            done();
        });
    });
});

describe('POST /get-slots', () => {
    it('should be able to get slots', (done) => {
        chai.request(config.url)
        .post('/get-slots')
        .send({
            "email": "ankanpathak1@gmail.com",
            "date": "2020-04-07"
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
            slotId = res.body.data[0]._id;
            done();
        });
    });
    
    it('should get empty list for no slots found', (done) => {
        chai.request(config.url)
        .post('/get-slots')
        .send({
            "email": "ankanpathak1@gmail.com",
            "date": "2019-01-01"
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

describe('DELETE /delete-slot', () => {
    it('should be able to delete a slot', (done) => {
        chai.request(config.url)
        .delete('/delete-slot')
        .send({
            "id": slotId
        })
        .set({
            "Authorization": "Bearer " + token
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status('200');
            expect(res.body.status).to.be.true;
            expect(res.body.data).to.not.be.null;
            expect(res.body.data._id).to.be.equal(slotId);
            done();
        });
    });
    
    it('should not be able to delete a slot that does not exist', (done) => {
        chai.request(config.url)
        .delete('/delete-slot')
        .send({
            "id": slotId
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

    //close db connection after tests complete
    after(() => connObj.close());
});