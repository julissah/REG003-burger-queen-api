const request = require('supertest');
const express = require('express');

const app = express();

// app.get('/auth', (req, res) => {
//   res.status(200);
// });

// request(app)
//   .get('/auth')
//   .expect('Content-Type', /json/)
//   .expect('Content-Length', '15')
//   .expect(200)
//   .end((err, res) => {
//     if (err) throw err;
//   });

// describe('POST /auth', () => {
//   it('responds with json', (done) => {
//     request(app)
//       .post('/auth')
//       .send('email=admin@localhost') // x-www-form-urlencoded upload
//       .send('password=adminbq') // x-www-form-urlencoded upload
//       .set('Accept', 'application/json')
//       .expect(200, done);
//   });
// });

describe('POST /user', () => {
  it('responds with json', (done) => {
    request(app)
      .post('/user')
      .send({ email: 'admin@localhost', password: 'adminbq' })
      .set('Accept', 'application/x-www-form-urlencoded')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe('POST /auth', () => {
  it('responds with json', (done) => {
    request(app)
      .post('/auth')
      .send({ email: 'admin@localhost', password: 'adminbq' })
      .set('Accept', 'application/x-www-form-urlencoded')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});
