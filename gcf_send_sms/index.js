const { Firestore } = require('@google-cloud/firestore');
const twilio = require('twilio');

exports.sendDealSMS = async (event, context) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const firestore = new Firestore({
    projectId: 'ahmoha-traveldeals',
  });

  const dealData = event.value.fields;
  const headline = dealData.headline.stringValue;
  const locations = dealData.locations.arrayValue.values.map((loc) => loc.stringValue);

  try {
    const subscribersSnapshot = await firestore.collection('subscribers')
      .where('watch_regions', 'array-contains-any', locations)
      .get();

    const subscribers = subscribersSnapshot.docs.map((doc) => doc.data());

    for (const subscriber of subscribers) {
      const phoneNumber = subscriber.phone_number;

      const message = await client.messages.create({
        body: `(ahmoha) New Deal: ${headline}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      console.log(`Deal SMS sent to ${phoneNumber}. Message SID: ${message.sid}`);
    }
  } catch (error) {
    console.error(`Error sending deal SMS: ${error}`);
  }
};