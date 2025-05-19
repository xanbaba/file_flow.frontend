// Configuration file for the application

// Auth0 configuration
export const auth0Config = {
  domain: "your-auth0-domain.auth0.com",
  clientId: "your-auth0-client-id",
  redirectUri: window.location.origin,
  audience: "https://your-api-identifier",
  scope: "openid profile email"
};

// API endpoints
export const apiConfig = {
  baseUrl: "https://api.example.com",
  endpoints: {
    files: "/files",
    folders: "/folders",
    users: "/users"
  }
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