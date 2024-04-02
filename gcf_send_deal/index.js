require('dotenv').config();
const {Firestore} = require('@google-cloud/firestore');
const sgMail = require('@sendgrid/mail');

exports.sendDealNotification = async (event, context) => {
  const triggerResource = context.resource;
  console.log(`Function triggered by event on: ${triggerResource}`);
  console.log(`Event type: ${context.eventType}`);

  const headline = event.value.fields.headline.stringValue;
  const locations = event.value.fields.locations.arrayValue.values.map(
    (loc) => loc.stringValue
  );

  console.log("Headline:", headline);
  console.log("Locations:", locations);

  try {
    // Connect to the Firestore database
    const db = new Firestore({
      projectId: "ahmoha-traveldeals"
    });

    // Reference to the "subscribers" collection
    const subscribersRef = db.collection('subscribers');

    // Query subscribers whose watch_regions match any of the deal locations
    const querySnapshot = await subscribersRef
      .where('watch_regions', 'array-contains-any', locations)
      .get();

    console.log(`Number of subscribers for the deal: ${querySnapshot.size}`);

    // Set up SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Iterate through the matching subscribers and send email notifications
    querySnapshot.forEach(async (doc) => {
      const subscriberEmail = doc.data().email_address;

      // Compose the email message
      const msg = {
        to: subscriberEmail,
        from: process.env.SENDGRID_SENDER,
        subject: `Ahmed ${headline}`,
        text: `A new travel deal has been posted for the following locations: ${locations.join(', ')}`,
        html: `<p>A new travel deal has been posted for the following locations: <strong>${locations.join(', ')}</strong></p>`,
      };

      try {
        // Send the email using SendGrid
        await sgMail.send(msg);
        console.log(`Email notification sent to ${subscriberEmail}`);
      } catch (error) {
        console.error(`Error sending email to ${subscriberEmail}:`, error);
      }
    });
  } catch (error) {
    console.error('Error querying Firestore or sending email:', error);
    throw error;
  }
};