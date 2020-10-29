import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { css, StyleSheet } from "aphrodite";

// Custom styling can be passed to options when creating an Element.
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = ({
  button,
  createStripeIntent,
  senderName,
  paymentError,
  paymentCallback,
}) => {
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  // Handle real-time validation errors from the card Element.
  const handleChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  // Handle form submission.
  const handleSubmit = async (event) => {
    event.preventDefault();
    const secret = await createStripeIntent();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardPayment(secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: senderName,
        },
      },
    });

    debugger;
    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
      paymentError && paymentError();
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.

        paymentCallback && paymentCallback();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div class="form-row">
        <CardElement
          id="card-element"
          options={CARD_ELEMENT_OPTIONS}
          onChange={handleChange}
          className={css(styles.stripeCard)}
          style={{ border: "1px solid #ddd", boxShadow: "none" }}
        />
        <div className={css(styles.error)} role="alert">
          {error}
        </div>
        <div className={css(styles.stripePoweredContainer)}>
          <img
            src={"/static/icons/stripe-powered.png"}
            className={css(styles.stripePowered)}
          />
        </div>
        {button}
      </div>
    </form>
  );
};

// Setup Stripe.js and the Elements provider
const stripePromise = loadStripe(
  "pk_test_51HWsNVAGaT1bvmb35MLvT9VwpsBXWF4fv4yKPa04wmJS7q6GMaSu4YRG1dDkj5DPIH26fxbCpP1RrkWpILXGW7lA00UicZYMTc"
);

const StripeForm = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

// POST the token ID to your backend.
async function stripeTokenHandler(token) {
  const response = await fetch("/charge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token.id }),
  });

  return response.json();
}

const styles = StyleSheet.create({
  stripeCard: {
    boxShadow: "none",
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    padding: 15,
  },
  error: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.8,
    color: "#eb1c26",
  },
  stripePoweredContainer: {
    display: "flex",
    justifyContent: "flex-end",
    // paddingTop: 10,
  },
  stripePowered: {
    width: 100,
  },
});

export default StripeForm;
