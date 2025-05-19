import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Auth0Provider } from '@auth0/auth0-react';
import './App.css';
import theme from './theme';
import Layout from './layouts/Layout';
import HomePage from './pages/Home/HomePage';
import { auth0Config } from './config';

function App() {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope
      }}
    >
      <ThemeProvider theme={theme}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* Add more routes as needed */}
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;
