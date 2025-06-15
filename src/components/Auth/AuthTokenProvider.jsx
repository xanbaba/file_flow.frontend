import { useEffect, useRef, useState, createContext, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setTokenProvider } from '../../services/api';

// Create a context to expose the token ready state
const AuthTokenContext = createContext();

// Hook to use the auth token context
export const useAuthToken = () => {
  const context = useContext(AuthTokenContext);
  if (!context) {
    throw new Error('useAuthToken must be used within an AuthTokenProvider');
  }
  return context;
};

/**
 * Component that sets up the token provider for API calls
 * This component doesn't render anything, it just sets up the token provider
 * and provides a context to indicate when the token is ready
 */
const AuthTokenProvider = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const getAccessTokenRef = useRef(getAccessTokenSilently);
  const [isTokenReady, setIsTokenReady] = useState(false);

  // Update the ref when getAccessTokenSilently changes
  useEffect(() => {
    getAccessTokenRef.current = getAccessTokenSilently;
  }, [getAccessTokenSilently]);

  useEffect(() => {
    // Only set up the token provider if the user is authenticated
    if (isAuthenticated) {
      // Create a token provider function that uses the ref to always access the latest getAccessTokenSilently
      const tokenProviderFn = async () => {
        try {
          return await getAccessTokenRef.current();
        } catch (error) {
          console.error('Error getting access token:', error);
          return null;
        }
      };

      // Set the token provider
      setTokenProvider(tokenProviderFn);

      // Initialize the token by calling it once
      const initToken = async () => {
        try {
          await tokenProviderFn();
          setIsTokenReady(true);
        } catch (error) {
          console.error('Error initializing token:', error);
          // Still set token as ready to avoid blocking the UI indefinitely
          setIsTokenReady(true);
        }
      };

      initToken();
    }
  }, [isAuthenticated]);

  // Provide the token ready state through context
  return (
    <AuthTokenContext.Provider value={{ isTokenReady }}>
      {children}
    </AuthTokenContext.Provider>
  );
};

export default AuthTokenProvider;
