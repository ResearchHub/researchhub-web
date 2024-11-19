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
    <Box className={css(styles.pageWrapper)}>
      <Container maxWidth="md">
        <Paper className={css(styles.container)}>
          <Box className={css(styles.successIcon)}>
            <CheckCircleIcon className={css(styles.icon)} />
          </Box>

          <h2 className={css(styles.heading)}>
            Your paper is now live on ResearchHub
          </h2>

          <Link 
            href={`/paper/${paper.id}/${paper.slug}`}
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

          <h3 className={css(styles.subheading)}>
            What happens next?
          </h3>
          
          <List sx={{ width: '100%' }}>
            {[
              { 
                icon: <CheckCircleIcon className={css(styles.greenIcon)} />,
                primary: "Preprint available on ResearchHub",
                secondary: "Completed",
                done: true
              },
              {
                icon: <RadioButtonUncheckedIcon className={css(styles.orangeIcon)} />,
                primary: "Peer review evaluations",
                secondary: "10 - 14 days",
                done: false
              },
              {
                icon: <RadioButtonUncheckedIcon className={css(styles.greyIcon)} />,
                primary: "Review quality check",
                secondary: "1 - 7 days",
                done: false
              },              
              {
                icon: <RadioButtonUncheckedIcon className={css(styles.greyIcon)} />,
                primary: "Paper published in ResearchHub Journal",
                done: false
              }
            ].map((item, index) => (
              <ListItem 
                key={index}
                className={css(styles.listItem, item.done && styles.listItemDone)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={
                    <span className={css(styles.listItemPrimary)}>
                      {item.primary}
                    </span>
                  }
                  secondary={
                    <span className={css(styles.listItemSecondary)}>
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
  pageWrapper: {
    minHeight: '100vh',
    background: '#FAFAFA',
    paddingTop: 48,
    paddingBottom: 80
  },
  container: {
    padding: 48,
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'white',
    position: 'relative',
    overflow: 'hidden',
    ':before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: colors.NEW_GREEN()
    }
  },
  successIcon: {
    animation: 'fadeIn 0.5s ease-out',
    '@keyframes fadeIn': {
      '0%': { opacity: 0, transform: 'translateY(10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' }
    }
  },
  icon: {
    fontSize: 70,
    color: colors.NEW_GREEN()
  },
  heading: {
    marginTop: 32,
    marginBottom: 32,
    textAlign: 'center',
    color: colors.NEW_GREEN(),
    fontWeight: 500,
    fontSize: 24
  },
  subheading: {
    marginBottom: 24,
    fontWeight: 600,
    textAlign: 'left',
    marginTop: 35,
    fontSize: 18,
    color: colors.BLACK()
  },
  paperButton: {
    padding: 24,
    marginBottom: 32,
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
    fontSize: 16,
    fontWeight: 400,
  },
  listItem: {
    padding: 16,
    borderLeft: `2px solid ${colors.GREY(0.3)}`,
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  listItemDone: {
    borderLeft: `2px solid ${colors.NEW_GREEN()}`,
    backgroundColor: colors.NEW_GREEN(0.1)
  },
  listItemPrimary: {
    fontWeight: 500,
    color: colors.BLACK()
  },
  listItemSecondary: {
    color: colors.MEDIUM_GREY2()
  },
  greenIcon: {
    color: colors.NEW_GREEN()
  },
  orangeIcon: {
    color: colors.ORANGE()
  },
  greyIcon: {
    color: colors.GREY()
  }
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