// API service for handling backend communication

import { apiConfig } from '../config';

// We'll use a token provider pattern to get the token from Auth0
let tokenProvider = null;

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Custom error class for conflict errors (409)
 */
export class ConflictError extends ApiError {
  constructor(message, data = null) {
    super(message, 409, data);
    this.name = 'ConflictError';
  }
}

/**
 * Custom error class for not found errors (404)
 */
export class NotFoundError extends ApiError {
  constructor(message, data = null) {
    super(message, 404, data);
    this.name = 'NotFoundError';
  }
}

/**
 * Custom error class for bad request errors (400)
 */
export class BadRequestError extends ApiError {
  constructor(message, data = null) {
    super(message, 400, data);
    this.name = 'BadRequestError';
  }
}

/**
 * Custom error class for unauthorized errors (401)
 */
export class UnauthorizedError extends ApiError {
  constructor(message, data = null) {
    super(message, 401, data);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Sets the token provider function
 * @param {Function} provider - A function that returns a promise resolving to a token
 */
export const setTokenProvider = (provider) => {
  tokenProvider = provider;
};

/**
 * Helper function to get auth token
 * @returns {Promise<string>} - Promise resolving to the auth token
 */
const getAuthToken = async () => {
  if (!tokenProvider) {
    console.warn('Token provider not set. Authentication will not work.');
    return null;
  }

  try {
    return await tokenProvider();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Helper function to make API requests with retry logic
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} initialDelay - Initial delay in ms before retrying
 * @returns {Promise<any>} - Promise resolving to the response data
 */
export const fetchWithRetry = async (url, options, maxRetries = 3, initialDelay = 1000) => {
  let lastError;
  let delay = initialDelay;

  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    try {
      // Add auth token to headers if not already present
      if (!options.headers.Authorization) {
        const token = await getAuthToken();
        if (token) {
          options.headers.Authorization = `Bearer ${token}`;
        }
      }

      const response = await fetch(url, options);

      // If response is not OK, handle different status codes
      if (!response.ok) {
        let errorData = null;

        // Try to parse error response as JSON
        try {
          errorData = await response.json();
        } catch (e) {
          // If parsing fails, continue with null errorData
        }

        const errorMessage = errorData?.message || response.statusText;

        // Handle specific status codes
        switch (response.status) {
          case 400:
            throw new BadRequestError(errorMessage, errorData);
          case 401:
            throw new UnauthorizedError(errorMessage, errorData);
          case 404:
            throw new NotFoundError(errorMessage, errorData);
          case 409:
            throw new ConflictError(errorMessage, errorData);
          default:
            throw new ApiError(errorMessage, response.status, errorData);
        }
      }

      return await response.json();
    } catch (error) {
      // Don't retry for client errors (4xx) except for network issues
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        throw error;
      }

      console.error(`Attempt ${retryCount + 1}/${maxRetries + 1} failed:`, error);
      lastError = error;

      if (retryCount < maxRetries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Exponential backoff: double the delay for the next retry
        delay *= 2;
      }
    }
  }

  throw lastError;
};

/**
 * Fetches children (files and folders) of a specific folder
 * @param {string} folderId - The ID of the folder to get children from. Use "root" for root folder.
 * @returns {Promise<Array>} - Promise resolving to an array of file and folder objects
 */
export const fetchFolderChildren = async (folderId = 'root') => {
  try {
    const data = await fetchWithRetry(
      `${apiConfig.baseUrl}/api/folders/${folderId}/children`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return data;
  } catch (error) {
    console.error('Error fetching folder children:', error);
    throw error;
  }
};

/**
 * Fetches metadata for a specific folder
 * @param {string} folderId - The ID of the folder to retrieve
 * @returns {Promise<Object>} - Promise resolving to a folder object
 */
export const fetchFolder = async (folderId) => {
  try {
    const data = await fetchWithRetry(
      `${apiConfig.baseUrl}/api/folders/${folderId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return data;
  } catch (error) {
    console.error('Error fetching folder:', error);
    throw error;
  }
};

/**
 * Creates a new folder
 * @param {string} folderName - The name for the new folder
 * @param {string|null} targetFolderId - The ID of the parent folder where the new folder should be created
 * @returns {Promise<Object>} - Promise resolving to the created folder object
 */
export const createFolder = async (folderName, targetFolderId = null) => {
  try {
    const data = await fetchWithRetry(
      `${apiConfig.baseUrl}/api/folders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderName,
          targetFolderId
        })
      }
    );
    return data;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};
