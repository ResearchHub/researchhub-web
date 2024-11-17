import { StyleSheet, css } from "aphrodite";
import { Box, Container, List, ListItem, ListItemIcon, ListItemText, Paper, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Link from 'next/link';
import colors from '~/config/themes/colors';
import { parsePaper } from "~/components/Document/lib/types";
import fetchPaper from "~/components/Document/api/fetchPaper";
import { useRouter } from "next/router";

interface PaymentSuccessProps {
  documentData: any;
}

export default function PaymentSuccess({ documentData }: PaymentSuccessProps) {

  const router = useRouter();
  if (router.isFallback || !documentData) {
    return  (
        <div
        style={{
          display: "flex",
          marginTop: "20%",
          justifyContent: "center",
          fontSize: 22,
        }}
      >
        Loading...
      </div>
    );
  }

  const paper = parsePaper(documentData);
  
  return (
    <Box sx={{ minHeight: '100vh', background: '#FAFAFA', pt: 6, pb: 10 }}>
      <Container maxWidth="md">
        <Paper 
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: colors.NEW_GREEN()
            }
          }}
        >
          <Box
            sx={{
              animation: 'fadeIn 0.5s ease-out',
              '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(10px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            <CheckCircleIcon 
              sx={{ 
                fontSize: 70,
                color: colors.NEW_GREEN()
              }} 
            />
          </Box>

          <h2 
            style={{ 
              marginTop: '32px',
              marginBottom: '32px',
              textAlign: 'center',
              color: colors.NEW_GREEN(),
              fontWeight: 500,
              fontSize: '24px'
            }}
          >
            Your paper is now live on ResearchHub
          </h2>

          <Link 
            href={`/paper/${paper.id}`}
            style={{ textDecoration: 'none', width: '100%' }}
          >
            <Button
              variant="contained"
              fullWidth
              className={css(styles.paperButton)}
            >
              <span className={css(styles.paperTitle)}>
                {paper.title}
              </span>
            </Button>
          </Link>

          <h3 
            style={{ 
              marginBottom: '24px',
              fontWeight: 600,
              textAlign: 'left',
              marginTop: '35px',
              fontSize: '18px',
              color: colors.BLACK()
            }}
          >
            What happens next?
          </h3>
          
          <List sx={{ width: '100%' }}>
            {[
              { 
                icon: <CheckCircleIcon sx={{ color: colors.NEW_GREEN() }} />,
                primary: "Preprint available on ResearchHub",
                secondary: "Completed",
                done: true
              },
              {
                icon: <RadioButtonUncheckedIcon sx={{ color: colors.ORANGE() }} />,
                primary: "Editor reviews submission",
                secondary: "1-3 days",
                done: false
              },
              {
                icon: <RadioButtonUncheckedIcon sx={{ color: colors.GREY() }} />,
                primary: "Peer review process",
                secondary: "1-14 days",
                done: false
              },
              {
                icon: <RadioButtonUncheckedIcon sx={{ color: colors.GREY() }} />,
                primary: "Publication in ResearchHub Journal",
                secondary: "Final step",
                done: false
              }
            ].map((item, index) => (
              <ListItem 
                key={index}
                sx={{
                  p: 2,
                  borderLeft: '2px solid',
                  borderColor: item.done ? colors.NEW_GREEN() : colors.GREY(0.3),
                  mb: 2,
                  backgroundColor: item.done ? `${colors.NEW_GREEN(0.1)}` : 'transparent',
                  borderRadius: 1
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={
                    <span style={{ 
                      fontWeight: 500,
                      color: colors.BLACK()
                    }}>
                      {item.primary}
                    </span>
                  }
                  secondary={
                    <span style={{ color: colors.MEDIUM_GREY2() }}>
                      {item.secondary}
                    </span>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>
  );
}

const styles = StyleSheet.create({
  paperButton: {
    padding: '24px',
    marginBottom: '32px',
    textTransform: 'none',
    backgroundColor: '#f8f9fa',
    color: colors.NEW_BLUE(),
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    ':hover': {
      backgroundColor: colors.NEW_BLUE(0.1),
      boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    },
    display: 'block',
    whiteSpace: 'normal',
    lineHeight: 1.4,
  },
  paperTitle: {
    fontSize: '16px',
    fontWeight: 400,
  },
});

export const getStaticProps = async (ctx) => {
  const { id } = ctx.params;
  
  try {
    const paper = await fetchPaper({ paperId: id });
    return {
      props: {
        documentData: paper,
      },
      revalidate: 600, // Revalidate every 10 minutes
    };
  } catch (error) {
    return {
      props: {
        errorCode: 404,
      },
      revalidate: 10, // Retry sooner if there was an error
    };
  }
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};