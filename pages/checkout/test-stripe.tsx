import { Box, Button, Container } from '@mui/material';
import API from "~/config/api";

export default function TestStripeCheckout() {
  const initiateCheckout = async () => {
    try {
      const response = await fetch(
        `${API.BASE_URL}payment/checkout-session/`,
        API.POST_CONFIG({
          success_url: 'http://localhost:3000/checkout/1/payment-success',
          failure_url: 'http://localhost:3000/checkout/1/payment-failure',
          paper: '1' // Test paper ID
        })
      );

      if (!response.ok) {
        throw new Error('Checkout session creation failed');
      }

      const data = await response.json();
      
      // Redirect to Stripe checkout URL
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (error) {
      console.error('Checkout Error:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Button
          variant="contained"
          onClick={initiateCheckout}
          sx={{
            p: 2,
            textTransform: 'none',
            fontSize: '16px'
          }}
        >
          Test Stripe Checkout
        </Button>
      </Box>
    </Container>
  );
} 