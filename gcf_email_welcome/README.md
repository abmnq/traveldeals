# GCF: Send Welcome Email to Subscribers

This is a Google Cloud Function triggered by a PubSub message to the topic `travel_deals_signup`. It will send a welcome email to a new subscriber using the SendGrid API.

## Setup for Initial Development

1. Run `npm install dotenv @sendgrid/mail`
2. Create a **.env** file with `touch .env`
3. Edit the `.env` file to add your SendGrid API key
4. Deploy

## Deployment Command
**Ensure you have an active Google Cloud Project**
```
gcloud functions deploy send_email_welcome \
--entry-point sendWelcome \
--runtime nodejs18 \
--trigger-topic=travel_deals_signup
```