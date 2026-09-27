const request = require('supertest');
const app = require('../server'); // Path to your Express app file

describe('Visa Card API Tests', () => {

  describe('POST /api/cards/validate', () => {
    test('should successfully validate a correct Visa card number', async () => {
      const res = await request(app)
        .post('/api/cards/validate')
        .send({
          cardNumber: "4000001234567892",
          expiryDate: "12/28",
          cvv: "123"
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'SUCCESS');
      expect(res.body.cardType).toEqual('Visa');
    });

    test('should reject an invalid card number that fails Visa format or Luhn algorithm', async () => {
      const res = await request(app)
        .post('/api/cards/validate')
        .send({
          cardNumber: "1234567890123456",
          expiryDate: "12/28",
          cvv: "123"
        });

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty('status', 'INVALID');
    });

    test('should return 400 Bad Request when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/cards/validate')
        .send({
          cardNumber: "4000001234567892"
          // expiryDate and cvv missing
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('ERROR');
    });
  });

  describe('POST /api/cards/issue', () => {
    test('should issue a mock Visa card when cardholder name is provided', async () => {
      const res = await request(app)
        .post('/api/cards/issue')
        .send({
          holderName: "John Doe"
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.cardHolder).toEqual("John Doe");
      expect(res.body.cardNumber).toEqual("4000001234567892");
    });

    test('should return 400 when cardholder name is omitted', async () => {
      const res = await request(app)
        .post('/api/cards/issue')
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });
  });

});
