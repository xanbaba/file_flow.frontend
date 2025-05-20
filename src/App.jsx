import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import './App.css';
import Layout from './layouts/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage from './pages/Home/HomePage';
import StarredPage from './pages/Starred/StarredPage';
import RecentPage from './pages/Recent/RecentPage';
import TrashPage from './pages/Trash/TrashPage';
import LoginPage from './pages/Login/LoginPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { auth0Config } from './config';

function App() {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri
      }}
    >
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public route for login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/starred" element={<StarredPage />} />
                <Route path="/recent" element={<RecentPage />} />
                <Route path="/trash" element={<TrashPage />} />
              </Route>
            </Route>

            {/* Redirect any unmatched routes to login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;
