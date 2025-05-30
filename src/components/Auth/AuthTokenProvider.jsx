import React, { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setTokenProvider } from '../../services/api';

/**
 * Component that sets up the token provider for API calls
 * This component doesn't render anything, it just sets up the token provider
 */
const AuthTokenProvider = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const getAccessTokenRef = useRef(getAccessTokenSilently);

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
    }
  }, [isAuthenticated]);

  // This component doesn't render anything, it just passes through its children
  return children;
};

export default AuthTokenProvider;
