'use strict';

const request = require('superagent');
const Accessory = require('../models/accessory');
//Include costume model to test the reference to accessory
require('../models/costume');

const mongoose = require('mongoose');
const expect = require('expect');

process.env.DB_URL = 'mongodb://localhost:27017/accessory_stg';
process.env.PORT = 5000;


beforeAll(() => {
  require('../lib/_server').start(process.env.PORT);
  return Accessory.remove({});
});

afterAll(() => {
  mongoose.connection.close();
  require('../lib/_server').stop;
});

let accessoryID = '';

describe('POST /api/1.0/accessory', () => {

  test('it should create a new accessory', () => {
    return request
      .post('localhost:5000/api/1.0/accessory')
      .send({parts: ['wig', 'hat', 'glasses']})
      .then((res) => {
        accessoryID = res.body._id;
        expect(res.body.parts).toEqual(['wig', 'hat', 'glasses']);
        expect(res.body._id).not.toEqual(undefined);
        expect(res.status).toBe(200);
      });
  });

  test('it should create another new accessory', () => {
    return request
      .post('localhost:5000/api/1.0/accessory')
      .send({parts: ['tude', 'mask', 'sword']})
      .then((res) => {
        expect(res.body.parts).toEqual(['tude', 'mask', 'sword']);
        expect(res.body._id).not.toBe(undefined);
        expect(res.status).toBe(200);
      });
  });

});

describe('GET /api/1.0/accessories', () => {

  test('it should return all accessories if no id is given', () => {
    return request
      .get('localhost:5000/api/1.0/accessories')
      .then(res => {
        expect(res.body[0].parts[0]).toEqual('wig');
        expect(res.body[1].parts[0]).toEqual('tude');
        expect(res.status).toBe(200);
      });
  });

  test('it should get a single accessory with id param', () => {
    return request
      .get(`localhost:5000/api/1.0/accessory/${accessoryID}`)
      .then(res => {
        expect(res.body.parts).toEqual(['wig', 'hat', 'glasses']);
        expect(res.status).toBe(200);
      });
  });

  test('it should return a 404 for invalid id', () => {
    let badID = 12345;
    return request
      .get(`localhost:5000/api/1.0/accessory/${badID}`)
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(404);
        expect(res.message).toEqual('Not Found');
      });
  });

});

describe('PUT /api/1.0/accessory', () => {

  test('it should update with a put when valid ID is given', () => {
    return request
      .put(`localhost:5000/api/1.0/accessory/${accessoryID}`)
      .send({parts: ['cape', 'facial hair', 'wig']})
      .then(res => {
        expect(res.text).toBe('Accessory has been updated!');
        expect(res.status).toEqual(200);
      });
  });

  //Create a costume and save the reference ObjectId to accessory
  let accRefID = '';

  test('it should create a new costume', () => {
    return request
      .post('localhost:5000/api/1.0/costume')
      .send({name: 'Unicorn', profile: 'grazes on peace and love'})
      .then((res) => {
        accRefID = res.body.parts;
        expect(res.body.parts).not.toBe(undefined);
        expect(res.status).toBe(200);
      });
  });

  test('it should update with an acc using the costume ref ID', () => {
    return request
      .put(`localhost:5000/api/1.0/accessory/${accRefID}`)
      .send({parts: ['kigarumi', 'slippers']})
      .then(res => {
        expect(res.text).toBe('Accessory has been updated!');
        expect(res.status).toEqual(200);
      });
  });

  test('it should return a 400 when no body is provided', () => {
    return request
      .put(`localhost:5000/api/1.0/accessory/${accessoryID}`)
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
      .put(`localhost:5000/api/1.0/accessory/${badID}`)
      .send({name: 'Joe Mama'})
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(404);
        expect(res.message).toEqual('Not Found');
      });
  });

});


describe('DELETE /api/1.0/accessory/:id', () => {

  test('it should be able to delete a accessory', () => {
    return request
      .delete(`localhost:5000/api/1.0/accessory/${accessoryID}`)
      .then(res => {
        expect(res.text).toEqual('Accessory has been deleted');
      });
  });
});
