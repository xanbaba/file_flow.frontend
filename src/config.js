// Configuration file for the application

// Auth0 configuration
export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || "your-auth0-domain.auth0.com",
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || "your-auth0-client-id",
  redirectUri: window.location.origin,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE || "your-auth0-audience",
};

// API endpoints
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "https://api.example.com",
};

// UI configuration
export const uiConfig = {
  appName: "FileFlow",
  theme: {
    primary: "#1976d2",
    secondary: "#dc004e"
  },
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100]
  }
};