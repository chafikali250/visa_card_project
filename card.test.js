const request = require('supertest');
const app = require('./server'); // Importation depuis le même dossier (root)

describe('Visa Card API Tests', () => {

  // Test 1: Validation d'une carte Visa valide
  test('should successfully validate a correct Visa card number', async () => {
    const res = await request(app)
      .post('/api/cards/validate')
      .send({
        cardNumber: "4532015112830366", // Numéro Visa valide (Luhn OK)
        expiryDate: "12/28",
        cvv: "123"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("SUCCESS");
  });

  // Test 2: Échec de validation pour un numéro invalide
  test('should fail validation for an invalid card number', async () => {
    const res = await request(app)
      .post('/api/cards/validate')
      .send({
        cardNumber: "1234567890123456", // Numéro invalide
        expiryDate: "12/28",
        cvv: "123"
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body.status).toEqual("INVALID");
  });

  // Test 3: Émission d'une nouvelle carte Visa (Mock)
  test('should issue a new mock Visa card', async () => {
    const res = await request(app)
      .post('/api/cards/issue')
      .send({
        holderName: "Ali Chafik"
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("cardNumber");
  });

});
