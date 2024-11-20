import { Box, Container, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Button from "~/components/Form/Button";

export default function PaymentCancelled() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Payment Cancelled</title>
      </Head>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center',
            gap: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Payment Cancelled
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your payment has been cancelled. No charges have been made to your account.
          </Typography>
          <Button
            label="Return to Home"
            onClick={() => router.push('/')}
            variant="contained"
            size="med"
          />
        </Box>
      </Container>
    </>
  )
}
