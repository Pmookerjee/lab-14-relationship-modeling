'use strict';

const request = require('superagent');
const Costume = require('../models/costume');
const mongoose = require('mongoose');
const expect = require('expect');

process.env.DB_URL = 'mongodb://localhost:27017/costumes_stg';
process.env.PORT = 4000;


beforeAll(() => {
  require('../lib/_server').start(process.env.PORT);
  return Costume.remove({});
});

afterAll(() => {
  mongoose.connection.close();
  require('../lib/_server').stop;
});

let costumeID = '';

describe('POST /api/1.0/costume', () => {

  test('it should create a new costume', () => {
    return request
      .post('localhost:4000/api/1.0/costume')
      .send({name: 'Jack Skellington', profile: 'professional skeleton'})
      .then((res) => {
        costumeID = res.body._id;
        expect(res.body.name).toBe('Jack Skellington');
        expect(res.body.profile).toBe('professional skeleton');
        expect(res.body.parts).not.toBe(undefined);
        expect(res.body._id).not.toBe(undefined);
        expect(res.status).toBe(200);
      });
  });

  test('it should create another new costume', () => {
    return request
      .post('localhost:4000/api/1.0/costume')
      .send({
        'name': 'Michael Jackson',
        'profile': 'entertainer, world dominator',
      })
      .then((res) => {
        expect(res.body.name).toBe('Michael Jackson');
        expect(res.body.profile).toBe('entertainer, world dominator');
        expect(res.body.parts).not.toBe(undefined);
        expect(res.body._id).not.toBe(undefined);
        expect(res.status).toBe(200);
      });
  });

  test('it should return a 400 if bad json is given', () => {
    return request
      .post('localhost:4000/api/1.0/costume')
      .send('Hello World')
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(400);
        expect(res.message).toEqual('Bad Request');
      });
  });

});

describe('GET /api/1.0/costumes', () => {

  test('it should return all costumes if no id is given', () => {
    return request
      .get('localhost:4000/api/1.0/costumes')
      .then(res => {
        expect(res.body[0].name).toBe('Jack Skellington');
        expect(res.body[1].name).toBe('Michael Jackson');
        expect(res.status).toBe(200);
      });
  });

  test('it should get a single costume with id param', () => {
    return request
      .get(`localhost:4000/api/1.0/costume/${costumeID}`)
      .then(res => {
        expect(res.body.name).toBe('Jack Skellington');
        expect(res.status).toBe(200);
      });
  });

  test('it should return a 404 for invalid id', () => {
    let badID = 12345;
    return request
      .get(`localhost:4000/api/1.0/costume/${badID}`)
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(404);
        expect(res.message).toEqual('Not Found');
      });
  });

});

describe('PUT /api/1.0/costume/:id', () => {

  test('it should update with a put when valid ID is given', () => {
    return request
      .put(`localhost:4000/api/1.0/costume/${costumeID}`)
      .send({name: 'Emma', profile: 'OG Avenger'})
      .then(res => {
        expect(res.text).toBe('Costume has been updated!');
        expect(res.status).toEqual(200);
      });
  });

  test('it should return a 400 when no body is provided', () => {
    return request
      .put(`localhost:4000/api/1.0/costume/${costumeID}`)
      .send({})
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(400);
        expect(res.message).toEqual('Bad Request');
      });
  });

  test('it should return a 404 when a bad ID is provided', () => {

    let badID = 12345;

    return request
      .put(`localhost:4000/api/1.0/costume/${badID}`)
      .send({name: 'Joe Mama'})
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(404);
        expect(res.message).toEqual('Not Found');
      });
  });

});


describe('DELETE /api/1.0/costume/:id', () => {

  test('it should be able to delete a costume', () => {
    return request
      .delete(`localhost:4000/api/1.0/costume/${costumeID}`)
      .then(res => {
        expect(res.text).toEqual('Costume has been deleted');
      });
  });
});
