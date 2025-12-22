// Create a test file: test-razorpay-fetch.ts
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_test_RobOm0OWIEcoFV',
  key_secret: 'gnHPz3myFl1te3iMNa1Noh7S',
});

async function testFetch() {
  try {
    // Step 1: Create test order
    const order = await razorpay.orders.create({
      amount: 50000,
      currency: 'INR',
      receipt: 'test_receipt_123',
    });

    console.log('Created order:', order.id);
    console.log('Status:', order.status); // "created"

    // Step 2: Try to fetch it
    const fetched = await razorpay.orders.fetch(order.id);
    console.log('Fetched status:', fetched.status); // Still "created"

    // Step 3: Try to get payments
    const payments = await razorpay.orders.fetchPayments(order.id);
    console.log('Payments:', payments.items.length); // Probably 0
  } catch (error) {
    console.error('Error:', error);
  }
}

testFetch();
