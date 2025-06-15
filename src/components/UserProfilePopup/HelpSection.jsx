import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Button, 
  TextField, 
  Grid, 
  useTheme, 
  alpha,
  Link,
  Alert
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  QuestionAnswer as FAQIcon,
  ContactSupport as ContactIcon,
  MenuBook as GuideIcon
} from '@mui/icons-material';
import { useForm, ValidationError } from '@formspree/react';
import { useAuth0 } from '@auth0/auth0-react';

const HelpSection = () => {
  const theme = useTheme();
  const { user } = useAuth0();
  const [state, handleFormspreeSubmit] = useForm("xdkzzgwd"); // Replace with your actual Formspree form ID
  const [subject, setSubject] = useState('');

  // Custom submit handler to combine subject and message
  const handleSubmit = (event) => {
    event.preventDefault();

    // Get the message from the form
    const formData = new FormData(event.target);
    const message = formData.get('message');

    // Create a formatted message with subject
    const formattedMessage = `Subject: ${subject}\n\n${message}`;

    // Create a new FormData object with the combined message
    const combinedFormData = new FormData();
    combinedFormData.append('email', user?.email || '');
    combinedFormData.append('message', formattedMessage);

    // Submit the form with the combined data
    handleFormspreeSubmit(combinedFormData);
  };

  const faqs = [
    {
      question: 'How do I upload files?',
      answer: 'To upload files, navigate to the folder where you want to upload, then click the "Upload" button in the toolbar. You can also drag and drop files directly into the browser window.'
    },
    {
      question: 'How do I share files with others?',
      answer: 'Select the file you want to share, then click the "Share" button in the file actions menu. You can then enter email addresses of people you want to share with and set their permission levels.'
    },
    {
      question: 'How do I recover deleted files?',
      answer: 'Deleted files are moved to the Trash. To recover them, navigate to the Trash section, select the files you want to recover, and click the "Restore" button.'
    },
    {
      question: 'What file types are supported?',
      answer: 'FileFlow supports all common file types including documents, images, videos, audio files, and archives. There are no restrictions on file types, but there may be size limits depending on your storage plan.'
    },
    {
      question: 'How do I organize my files?',
      answer: 'You can create folders to organize your files by clicking the "New Folder" button. You can also use the star feature to mark important files for quick access, and use the search function to find files by name or content.'
    }
  ];

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
      {/* FAQ Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: '16px',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.custom.yellow, 0.15),
              color: theme.palette.custom.darkBrown,
              mr: 2
            }}
          >
            <FAQIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Frequently Asked Questions
          </Typography>
        </Box>

        <Box>
          {faqs.map((faq, index) => (
            <Accordion 
              key={index} 
              elevation={0}
              sx={{ 
                mb: 1, 
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: '10px !important',
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  margin: '0 0 16px 0',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  borderRadius: '10px',
                  '&.Mui-expanded': {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="textSecondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>

      {/* User Guide Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: '16px',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.custom.beige, 0.15),
              color: theme.palette.custom.darkBrown,
              mr: 2
            }}
          >
            <GuideIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            User Guide
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Check out our comprehensive user guide to learn more about FileFlow's features and how to use them effectively.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Link 
                href="#" 
                underline="none" 
                sx={{ 
                  display: 'block',
                  p: 2,
                  borderRadius: '10px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                  Getting Started Guide
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Learn the basics of FileFlow
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Link 
                href="#" 
                underline="none" 
                sx={{ 
                  display: 'block',
                  p: 2,
                  borderRadius: '10px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                  Advanced Features
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Discover advanced functionality
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Link 
                href="#" 
                underline="none" 
                sx={{ 
                  display: 'block',
                  p: 2,
                  borderRadius: '10px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                  Sharing & Collaboration
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Learn how to work with others
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Link 
                href="#" 
                underline="none" 
                sx={{ 
                  display: 'block',
                  p: 2,
                  borderRadius: '10px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                  Security & Privacy
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Understand how we protect your data
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Contact Support Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.custom.lightGreen, 0.15),
              color: theme.palette.custom.darkBrown,
              mr: 2
            }}
          >
            <ContactIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Contact Support
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Can't find what you're looking for? Our support team is here to help. Fill out the form below and we'll get back to you as soon as possible.
          </Typography>

          {state.succeeded ? (
            <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }}>
              Thanks for reaching out! We'll get back to you as soon as possible.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* We don't need the hidden email field anymore as we're handling it in the custom submit handler */}
                <ValidationError 
                  prefix="Email" 
                  field="email"
                  errors={state.errors}
                />

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Subject
                  </Typography>
                  <TextField 
                    fullWidth 
                    name="subject"
                    placeholder="What do you need help with?"
                    size="small"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Message
                  </Typography>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={4} 
                    name="message"
                    placeholder="Please describe your issue in detail"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      }
                    }}
                  />
                  <ValidationError 
                    prefix="Message" 
                    field="message"
                    errors={state.errors}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit"
                    variant="contained" 
                    color="primary"
                    disabled={state.submitting}
                    sx={{ 
                      mt: 1,
                      borderRadius: '10px',
                      textTransform: 'none',
                      px: 3
                    }}
                  >
                    {state.submitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default HelpSection;
