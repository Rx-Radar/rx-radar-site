// stripe webhook handler
import Stripe from 'stripe';

// // move this from here
const STRIPE_SECRET_KEY = 'sk_test_51LAi2vDj2y9TDEKrIYAAmSAQb87yWT0El6kTYypvIoBQZjLNuBRaRf7y3Fu72yr1ql8Z5n93P2EziPcyCR5olsLe005KDjmk5Y'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  // Set the API version to use with Stripe
  apiVersion: '2024-04-10',
});


export async function POST(request) {
    if (request.method === 'POST') {

        if (typeof sig !== 'string') {
            // Return a 400 Bad Request error if signature is missing or not a string
            return res.status(400).end('Invalid Stripe Signature');
        }
        
        const sig = request.headers['stripe-signature'];
        let event;
        
        try {
            event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
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
    
    } else {
        // Return a 405 Method Not Allowed error for non-POST requests
        response.setHeader('Allow', 'POST');

        return new Response('Method Not Allowed', {
            status: 405,
        })
    }
};
