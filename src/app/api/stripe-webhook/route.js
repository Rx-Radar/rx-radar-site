// stripe webhook handler
import Stripe from 'stripe';

// move this from here
const STRIPE_SECRET_KEY = 'sk_test_51LAi2vDj2y9TDEKrIYAAmSAQb87yWT0El6kTYypvIoBQZjLNuBRaRf7y3Fu72yr1ql8Z5n93P2EziPcyCR5olsLe005KDjmk5Y'
const endpointSecret = 'whsec_pSd2kFFsHa9vNDiGRPYN1RdelGf8ARwr'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    // Set the API version to use with Stripe
    apiVersion: '2024-04-10',
});


export async function POST(request) {
    print('request this bobby, ', request.body)
    let event = request.body;

    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
        event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return new Response(`⚠️  Webhook signature verification failed. ${err.message}`, {
            status: 400,
        })
    }


    // Handle the event based on its type
    switch (event.type) {
        case 'payment_intent.succeeded':
            // Handle payment success event
            console.log('Payment intent succeeded:', event.data.object);
            break;
        case 'payment_intent.payment_failed':
            // Handle payment failure event
            console.log('Payment intent failed:', event.data.object);
            break;
        // Add more cases for other event types as needed
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
    // Return a response to acknowledge receipt of the event
    return new Response({ received: true }, {
        status: 200,
    })
};
