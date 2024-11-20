import { Box, Button, Container, TextField } from '@mui/material';
import API from "~/config/api";
import { useState } from 'react';

export default function TestStripeCheckout() {
  const [paperId, setPaperId] = useState('');

  const initiateCheckout = async () => {
    if (!paperId.trim()) {
      alert('Please enter a paper ID');
      return;
    }

    try {
      const response = await fetch(
        `${API.BASE_URL}payment/checkout-session/`,
        API.POST_CONFIG({
          success_url: `${window.location.protocol}//${window.location.host}/checkout/${paperId}/payment-success`,
          failure_url: `${window.location.protocol}//${window.location.host}/checkout/${paperId}/payment-failure`,
          paper: paperId
        })
      );

      if (!response.ok) {
        throw new Error('Checkout session creation failed');
      }

      const data = await response.json();
      
      // Redirect user to Stripe's hosted checkout page
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Checkout Error:', error);
      alert('Failed to initiate checkout. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <TextField
          label="Paper ID"
          value={paperId}
          onChange={(e) => setPaperId(e.target.value)}
          sx={{ width: '200px' }}
        />
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