// stripe webhook handler
import Stripe from 'stripe';
import Twilio from 'twilio';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "rxradar",
        "private_key_id": "********HIDDEN********",
        "private_key": "********HIDDEN********",
        "client_email": "firebase-adminsdk-q0j5o@rxradar.iam.gserviceaccount.com",
        "client_id": "116189536224647585405",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-q0j5o%40rxradar.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
    })
});

// Get a reference to the Firestore database
const db = admin.firestore();

// Your Twilio account credentials
const TWILIO_ACCOUNT_SID = '********HIDDEN********';
const TWILIO_AUTH_TOKEN = '********HIDDEN********';
const TWILIO_PHONE_NUMBER = '********HIDDEN********';

// Initialize Twilio client
const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// move this from here
const STRIPE_SECRET_KEY = '********HIDDEN********'
const endpointSecret = '********HIDDEN********'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    // Set the API version to use with Stripe
    apiVersion: '2024-04-10',
});

// stripe payment update webhook
export async function POST(request) {
    try {
        const body = await request.text()

        let event = request.body;
    
        if (endpointSecret) {
            // Get the signature sent by Stripe
            const signature = request.headers.get("stripe-signature");
            try {
                event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
            } catch (err) {
                console.log(`⚠️  Webhook signature verification failed.`, err.message);
                return new Response(`⚠️  Webhook signature verification failed. ${err.message}`, {
                    status: 400,
                })
            }
        }
    
        // Handle the event based on its type
        switch (event.type) {
            case 'checkout.session.completed':
                const searchRequestUuid = event.data.object.client_reference_id;
                await onPaymentSuccess(searchRequestUuid);
                break;

            case 'payment_intent.succeeded':
                // Handle payment success event once money hits our payout 
                // console.log('Payment intent succeeded:', event.data.object);
                // await onPaymentSuccess();
                break;
            case 'payment_intent.payment_failed':
                // Handle payment failure event
                // console.log('Payment intent failed:', event.data.object);
                // await sendFailureSMS(searchRequestUuid, 'RxRadar update: your payment failed and your search was not placed')
                break;
            // Add more cases for other event types as needed
            default:
                // console.log(`Unhandled event type: ${event.type}`);
                break;
                
        }
        // Return a response to acknowledge receipt of the event
        return new Response({ received: true }, {
            status: 200,
        })

    }catch (error) {
        return new Response(`Webhook error: ${error.message}`, {
            status: 400,
        })
    }
};


// called on stripe payment success
async function onPaymentSuccess(searchRequestUuid) {
    try {
        // move doc to pending 
        await moveDocumentToSearchRequests(searchRequestUuid)

        const userUuid = await getUserUuid(searchRequestUuid);

        // increment user_credits in user doc by 1
        const userDocRef = db.collection('prod_users').doc(userUuid);
        await userDocRef.update({
            search_credits: admin.firestore.FieldValue.increment(1)
        });

    } catch (error) {
        console.error('Error getting user UUID:', error);
        throw error;
    }
}

// moves search request from pending to triggered list
async function moveDocumentToSearchRequests(searchRequestUuid) {
    try {
        // Reference to the document in pending_search_requests
        const pendingDocRef = db.collection('prod_pending_search_requests').doc(searchRequestUuid);

        // Get the document data
        const docSnapshot = await pendingDocRef.get();
        if (docSnapshot.exists) {
            const data = docSnapshot.data();

            // Create a new document in search_requests
            const searchRequestsRef = db.collection('prod_search_requests').doc(searchRequestUuid);
            await searchRequestsRef.set(data);

            // Delete the document from pending_search_requests
            await pendingDocRef.delete();

            console.log(`Document ${searchRequestUuid} moved to search_requests.`);
        } else {
            console.error(`Document ${searchRequestUuid} does not exist in pending_search_requests.`);
        }
    } catch (error) {
        sendFailureSMS(searchRequestUuid, 'RxRadar update: something went wrong, but don\'t worry we wont charge you for your next search')
    }
}

// send twilio sms on search request failure
async function sendFailureSMS(searchRequestUuid, msg) {
    const userUuid = await getUserUuid(searchRequestUuid)
    const userPhoneNumber = (await db.collection('prod_users').doc(userUuid).get()).data().phone

    try {
        // Send SMS using Twilio
        await twilioClient.messages.create({
            body: msg,
            to: userPhoneNumber,
            from: TWILIO_PHONE_NUMBER,
        });
    } catch (error) {
        throw error;
    }
}

// returns user uuid
async function getUserUuid(searchRequestUuid) {
    try {
        const pendingSearchDocRef = db.collection('prod_search_requests').doc(searchRequestUuid);
        const userUuid = (await pendingSearchDocRef.get()).data().user_uuid;
        return userUuid
    } catch (error) {
        return null;
    }
}
