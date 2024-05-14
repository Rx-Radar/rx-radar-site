// stripe webhook handler
import Stripe from 'stripe';

// move this from here
const STRIPE_SECRET_KEY = 'sk_test_51LAi2vDj2y9TDEKrIYAAmSAQb87yWT0El6kTYypvIoBQZjLNuBRaRf7y3Fu72yr1ql8Z5n93P2EziPcyCR5olsLe005KDjmk5Y'
const endpointSecret = 'whsec_aec1773c7f7ad8be1d1dcc93c4abb7b02f69dbaee14f1cf3d832b2d0a3b42a42'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    // Set the API version to use with Stripe
    apiVersion: '2024-04-10',
});


export async function POST(request) {
    try {
        const body = await request.text()

        let event = request.body;
    
        if (endpointSecret) {
            // Get the signature sent by Stripe
            const signature = request.headers.get("stripe-signature");
            console.log('signatureeee, ', signature);
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

    }catch (error) {
        return new Response(`Webhook error: ${error.message}`, {
            status: 400,
        })
    }
};
