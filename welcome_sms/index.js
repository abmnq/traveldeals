require('dotenv').config();
const twilio = require('twilio');

exports.sendWelcomeSMS = async (message, context) => {
  console.log(`Encoded message: ${message.data}`);

  const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');
  const parsedMessage = JSON.parse(incomingMessage);

  console.log(`Decoded message: ${JSON.stringify(parsedMessage)}`);
  console.log(`Phone number: ${parsedMessage.phone_number}`);

  // GET OUR TWILIO ACCOUNT SID AND AUTH TOKEN
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const msg = {
    body: 'Ahmed Welcome to TravelDeals!',
    from: process.env.TWILIO_PHONE_NUMBER,
    to: parsedMessage.phone_number
  };

  client.messages
    .create(msg)
    .then(message => {
      })
    .catch(error => {
      console.error(`Error sending welcome SMS to ${parsedMessage.phone_number}:`, error);
    });
};