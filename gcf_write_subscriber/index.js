const {Firestore} = require('@google-cloud/firestore');

exports.SubscriberFB = async (message, context) =>{
    const firestore = new Firestore({
        projectId: 'ahmoha-traveldeals'
    });
    try {
    const incoming = Buffer.from(message.data,'base64').toString('utf-8');
    const parsedMsg = JSON.parse(incoming);
    const subscriberData = {
        email_address: parsedMsg.email_address,
        watch_regions: parsedMsg.watch_region,
        phone_number: parsedMsg.phone_number,
    };
    let collectionRef = firestore.collection('subscribers');
    const docRef = await collectionRef.add(subscriberData);
    console.log(`New subscriber document added with ID: ${docRef.id}`);
} catch (error) {
    console.error(`Error adding document to Firestore: ${error}`);
}
};


