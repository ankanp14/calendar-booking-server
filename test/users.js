const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const config = require('../config');

let token;
let connObj;

describe('POST /registration', () => {

    //create db connection
    before((done) => {
        mongoose.connect(config.testDbUrl, { dbName: config.testDbName, useNewUrlParser: true, useUnifiedTopology: true })
            .then((conn) => {
                connObj = conn.connection;
                return conn.connection.db.dropCollection('users');
            })
            .then(() => done())
            .catch((err) => done());// throws error if the collection does not exist
    });
    it('should not get error for saving new user', (done) => {
        chai.request(config.url)
        .post('/registration')
        .send({
            "name": "Ankan Pathak",
            "email": "ankanpathak1@gmail.com",
            "password": "test123"
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status('200');
            expect(res.body.status).to.be.true;
            done();
        });
    });

    it('should get error for saving duplicate user', (done) => {
        chai.request(config.url)
        .post('/registration')
        .send({
            "name": "Ankan Pathak",
            "email": "ankanpathak1@gmail.com",
            "password": "test123"
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res.body.status).to.be.false;
            expect(res).to.have.status('200');
            done();
        });
    });
});

describe('POST /login', () => {
    it('should get error if user does not exist', (done) => {
      chai.request(config.url)
          .post('/login')
          .send({
              "name": "TEST USER",
              "email": "abc@gmail.com",
              "password": "test123"
          })
          .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status('200');
              expect(res.body.status).to.be.false;
              done();
          });
    });
  
    it('should get token for valid user', (done) => {
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

describe('POST /get-user', () => {
    it('should get auth error', (done) => {
        chai.request(config.url)
        .post('/get-user')
        .send({
            "email": "ankanpathak1@gmail.com"
        })
        .end((err, res) => {
            expect(err).to.be.null;
            chai.assert.isNotNull(res.error);
            expect(res).to.have.status('403');
            done();
        });
    });
    it('should get error if user does not exist', (done) => {
        chai.request(config.url)
        .post('/get-user')
        .send({
            "email": "abc@gmail.com"
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
  
    it('should get token for valid user', (done) => {
        chai.request(config.url)
        .post('/get-user')
        .send({
            "email": "ankanpathak1@gmail.com"
        })
        .set({
            "Authorization": "Bearer " + token
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res.body.status).to.be.true;
            expect(res.body.message).to.be.equal("user found");
            expect(res.body.data).to.be.not.null;
            if (res.body.data) {
                expect(res.body.data.id).to.be.not.null;
            }
            expect(res).to.have.status('200');
            done();
        });
    });

    //close db connection after tests complete
    after(() => connObj.close());
});