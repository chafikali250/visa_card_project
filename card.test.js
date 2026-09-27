const request = require('supertest');
const app = require('./server');

describe('Visa Card API Tests', () => {

  describe('POST /api/cards/validate', () => {
    test('should successfully validate a correct Visa card number', async () => {
      const res = await request(app)
        .post('/api/cards/validate')
        .send({
          cardNumber: '4000001234567892',
          expiryDate: '12/28',
          cvv: '321'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('SUCCESS');
    });

    test('should fail validation for an invalid card number', async () => {
      const res = await request(app)
        .post('/api/cards/validate')
        .send({
          cardNumber: '1234567890123456',
          expiryDate: '12/28',
          cvv: '321'
        });

      expect(res.statusCode).toEqual(422);
      expect(res.body.status).toEqual('INVALID');
    });
  });

  describe('POST /api/cards/issue', () => {
    test('should issue a new mock Visa card', async () => {
      const res = await request(app)
        .post('/api/cards/issue')
        .send({
          holderName: 'John Doe'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.cardHolder).toEqual('John Doe');
      expect(res.body.cardNumber).toBeDefined();
    });
  });

});
