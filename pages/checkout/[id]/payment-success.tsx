import { Box, Typography, Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ShareIcon from '@mui/icons-material/Share';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Link from 'next/link';

export default function PaymentSuccess() {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 6 }}>
      {/* Success Icon */}
      <CheckCircleIcon 
        sx={{ 
          fontSize: 80, 
          color: 'success.main',
          mb: 3 
        }} 
      />

      {/* Main Message */}
      <Typography variant="h3" gutterBottom>
        Congratulations
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        A preprint version of your paper is live on ResearchHub
      </Typography>

      {/* Paper Title Link */}
      <Link href="/paper/title" style={{ textDecoration: 'none' }}>
        <Typography 
          variant="subtitle1" 
          color="primary"
          sx={{ mb: 4 }}
        >
          Evolution of priorities in strategic funding for collaborative health research.
        </Typography>
      </Link>

      {/* Share Section */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Let your colleagues know
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
        <ShareIcon sx={{ cursor: 'pointer' }} />
        <TwitterIcon sx={{ cursor: 'pointer' }} />
        <LinkedInIcon sx={{ cursor: 'pointer' }} />
      </Box>

      {/* Timeline Section */}
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'left', mt: 4 }}>
        What happens next?
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon color="success" />
          </ListItemIcon>
          <ListItemText 
            primary="Preprint available on ResearchHub"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <RadioButtonUncheckedIcon sx={{ color: 'warning.main' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Editor reviews submission"
            secondary="1-3 days"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <RadioButtonUncheckedIcon color="disabled" />
          </ListItemIcon>
          <ListItemText 
            primary="Decision on manuscript by peer reviewers"
            secondary="1-14 days"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <RadioButtonUncheckedIcon color="disabled" />
          </ListItemIcon>
          <ListItemText 
            primary="Paper published in ResearchHub Journal"
          />
        </ListItem>
      </List>
    </Container>
  );
}