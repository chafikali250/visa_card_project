const express = require('express');
const app = express();

// Middleware to parse incoming JSON
app.use(express.json());

/**
 * Validates a Visa credit card number using Regex and the Luhn Algorithm.
 * @param {string} cardNumber - The card number string to validate.
 * @returns {boolean} True if valid Visa card, false otherwise.
 */
function isValidVisa(cardNumber) {
  // Visa cards start with 4 and are 13 or 16 digits long
  const regex = /^4[0-9]{12}(?:[0-9]{3})?$/;
  if (!regex.test(cardNumber)) return false;

  let sum = 0;
  let shouldDouble = false;

  // Luhn Algorithm calculation
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

// Endpoint: Validate Visa Card
app.post('/api/cards/validate', (req, res) => {
  const { cardNumber, expiryDate, cvv } = req.body;

  if (!cardNumber || !expiryDate || !cvv) {
    return res.status(400).json({ 
      status: "ERROR", 
      message: "All fields (cardNumber, expiryDate, cvv) are required." 
    });
  }

  const isValid = isValidVisa(cardNumber);
  if (isValid) {
    return res.json({ 
      status: "SUCCESS", 
      message: "Valid Visa card.", 
      cardType: "Visa" 
    });
  } else {
    return res.status(422).json({ 
      status: "INVALID", 
      message: "Invalid Visa card number." 
    });
  }
});

// Endpoint: Issue Mock Visa Card
app.post('/api/cards/issue', (req, res) => {
  const { holderName } = req.body;

  if (!holderName) {
    return res.status(400).json({ 
      status: "ERROR",
      message: "Cardholder name is required." 
    });
  }

  // Mock valid Visa card for testing
  const mockVisaCard = "4000001234567892"; 

  res.status(201).json({
    message: "Card issued successfully.",
    cardHolder: holderName,
    cardNumber: mockVisaCard,
    expiryDate: "12/28",
    cvv: "321"
  });
});

module.exports = app;

// Start server if executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Visa Service running on port ${PORT}`));
}
