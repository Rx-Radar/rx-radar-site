// stripe webhook handler
import Stripe from 'stripe';
import Twilio from 'twilio';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "rxradar",
        "private_key_id": "9702ad6752e0b929506eb37f7a2452431257b8bd",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCnMtYBNBgKYyN7\n9nPXraJZ2Vjo6EhdiVrNgXmv+tYNxHsw736CY8bzJU/CVVJUNN/rqvVR0EFWDqJX\nDiiXwaTwnFDXlJPTWsn4Ob8Jujf0DbTx6a2omySuv3cq0Z8sGH0YfjLuG52DQ9+8\nX4SDHUvUOvvOdnk6jYvLEOGGh/R7C2x0vxmphIBpyKuYvo6excZ/KdxPx88pBiZ1\nIH9JXgGwKCkhWeL1cpUGJfpBP5UrbAlrO8eUcsiRFdv6iH+DiGp6cvB0I8N8JQxN\nzixvP5L2C03Gv5XL0ktP9li+VQLzDnS7QSq8r/Ww24SSMzuhSgmW8Ogr7wt6TuYi\nHhDPC5RFAgMBAAECggEAHI6UubDlmESVh3MxFvnbnGAAjQs7bOpsXWRLXfDIRaK0\n7cdCAtA650WMqWL8RFChnDVfYCFjP2kRdi//Y+gZnVT9g8ynMPa1P1XRmL47F06O\nBLGGTSFucwBVwLT77EKkfx3y4fNKhGR/3sMrtV84F+AZKQrYKtWJNl5EPr+S1L74\nNblu4hTk6q3955VDWo8w5aaCUaRqvb/IrBBxPLF8dQFRjHkiviDBpt7d+rIZts3e\nBolUjALYhSew7S2n78qwXWzHfslKZZL9dpbvEbtvTAZHvxpb4y2iWYeWiNvh0EuI\npHOVqfmb9FpsubQjtYVoOK/DrFhfyTRedqbsi/+YIQKBgQDlDUKbr8aUPdW7N1zf\n5pyNk4QH/qP9QQrv6nBNtmsK7u4PRjIrVIf+dIH/d9GwOw5VqFEpQ+n6tmyYEDG7\nH7xRW4iRgdDnT7QrZXeKscm/S/aWkRpGGryVlMkzQoqkhwe6fGknPEt7gnl6KTfH\nOCp3S4AENeaTy/RoEKeSxCjF8QKBgQC63qNM/J4BxWZuwrbXiSNv55Q4R7NSsnbF\ns90jeKeIqCSrkXlQYq+cQr+lFBlvl89WdrcuUmC+8U876en4To8oBKsc9sPzN/hf\nm5xKnIbaaX47ysIpnJS7RgM8I06IdCkC/yIQwOpFVBlbT63hWaYZ5CiT0hRnIezz\nZJlx+utPlQKBgQCfehIMT+BVSpBLX4qcofYSZMkiv9rx851n2bUDhqUU4bKCk/9O\nR/a/5eK1OnmW2Cds4FpR/uUkGGuXnH7jqH73rmFx3g7TXp01Mdp/iLXNKVixEKpY\ncTkodIV52TSqxRFOeFzGYqazge6ObbBWVvbKRJkHVXgLI5Ax/JaQC1/QIQKBgQCL\n9YY/ehDp6KxAlsuVANyuyrbDtEgFzy6QApfFIm/wNWdJrOo8n71BfujEvhoS75PW\nAZJPOlnFiTy79gVL+aLU6TIzvkqi1q/LA+R6KWQDH/Hw3Hqx6dmnrddsalE+eCnj\nWa1s+OA9zrAzKKll19xFFhKiLD0lxU4QOa+Ho9QsRQKBgQDD5fQq0XEGTwbdjVVy\nDNAhBndBrSXi/0p8w6PJC5U2axg22ZRlIr77Ern/s8Pq41J9vVzy5HRnA+IqNv4m\nSI+pOP4ToxINwhQrxFT9Xzv5F3IwfHW3xp/sc+yJr2S9N3q8ug1bOfUORZstQmX3\nfLSDt5181txRXzL0kzAFB5QxnQ==\n-----END PRIVATE KEY-----\n",
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
const TWILIO_ACCOUNT_SID = 'AC3d433258fe9b280b01ba83afe272f438';
const TWILIO_AUTH_TOKEN = '2cc106ae7b360c99a7be11cc4ea77c07';
const TWILIO_PHONE_NUMBER = '+18337034125';

// Initialize Twilio client
const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// move this from here
const STRIPE_SECRET_KEY = 'sk_test_51LAi2vDj2y9TDEKrIYAAmSAQb87yWT0El6kTYypvIoBQZjLNuBRaRf7y3Fu72yr1ql8Z5n93P2EziPcyCR5olsLe005KDjmk5Y'
const endpointSecret = 'whsec_pSd2kFFsHa9vNDiGRPYN1RdelGf8ARwr'

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
    const userPhoneNumber = (await db.collection('users').doc(userUuid).get()).data().phone

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