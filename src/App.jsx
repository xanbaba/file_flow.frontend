import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Auth0Provider } from '@auth0/auth0-react';
import './App.css';
import theme from './theme';
import Layout from './layouts/Layout';
import HomePage from './pages/Home/HomePage';
import StarredPage from './pages/Starred/StarredPage';
import RecentPage from './pages/Recent/RecentPage';
import TrashPage from './pages/Trash/TrashPage';
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
              <Route path="/starred" element={<StarredPage />} />
              <Route path="/recent" element={<RecentPage />} />
              <Route path="/trash" element={<TrashPage />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;
