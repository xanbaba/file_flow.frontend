import { createTheme } from '@mui/material/styles';

// Color palette from guidelines: #251605, #f6e27f, #e2c391, #a8b7ab, #9bbec7
const theme = createTheme({
  palette: {
    primary: {
      main: '#9bbec7', // Light blue (Apple-like primary color)
      light: '#b5d1d8',
      dark: '#7a9ba3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e2c391', // Beige
      light: '#ebd5b0',
      dark: '#c9a973',
      contrastText: '#000000',
    },
    background: {
      default: '#f5f5f7', // Light gray (Apple-like background)
      paper: '#ffffff',
    },
    text: {
      primary: '#1d1d1f', // Dark gray (Apple-like text)
      secondary: '#86868b', // Medium gray (Apple-like secondary text)
    },
    custom: {
      darkBrown: '#251605', // Original dark brown
      yellow: '#f6e27f', // Original yellow
      beige: '#e2c391', // Beige
      lightGreen: '#a8b7ab', // Light green
      lightBlue: '#9bbec7', // Light blue
    },
    error: {
      main: '#ff3b30', // Apple-like red
    },
    warning: {
      main: '#ff9500', // Apple-like orange
    },
    info: {
      main: '#007aff', // Apple-like blue
    },
    success: {
      main: '#34c759', // Apple-like green
    },
  },
  typography: {
    fontFamily: [
      'SF Pro Rounded',
      'SF Pro Display',
      'Helvetica Neue',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12, // More rounded corners (Apple-like)
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          padding: '8px 16px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#b5d1d8',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#ebd5b0',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Translucent white (Apple-like)
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          color: '#1d1d1f', // Dark text on light background
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f5f5f7', // Light gray (Apple-like)
          borderRight: 'none',
          boxShadow: '1px 0px 5px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#9bbec7', // Light blue for icons
          minWidth: '40px',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          borderRadius: '4px', // More rounded icons
          '&:not(.MuiListItemIcon-root .MuiSvgIcon-root)': {
            strokeWidth: 0.5,
          },
        },
      },
    },
  },
});

export default theme;
