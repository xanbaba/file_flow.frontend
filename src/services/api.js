// API service for handling backend communication
// noinspection ExceptionCaughtLocallyJS

import {apiConfig} from '../config';

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
        } catch {
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

      // Check if the response has content before trying to parse it as JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // For empty responses or non-JSON responses, return an empty object
        return {};
      }
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
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/folders/${folderId}/children`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
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
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/folders/${folderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
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
    return await fetchWithRetry(
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
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

/**
 * Renames a file
 * @param {string} fileId - The ID of the file to rename
 * @param {string} newName - The new name for the file
 * @returns {Promise<Object>} - Promise resolving to the updated file object
 */
export const renameFile = async (fileId, newName) => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/files/${fileId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newName
          })
        }
    );
  } catch (error) {
    console.error('Error renaming file:', error);
    throw error;
  }
};

/**
 * Renames a folder
 * @param {string} folderId - The ID of the folder to rename
 * @param {string} newFolderName - The new name for the folder
 * @returns {Promise<Object>} - Promise resolving to the updated folder object
 */
export const renameFolder = async (folderId, newFolderName) => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/folders/${folderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newFolderName
          })
        }
    );
  } catch (error) {
    console.error('Error renaming folder:', error);
    throw error;
  }
};

/**
 * Moves a file or folder to a different folder
 * @param {string} itemId - The ID of the file or folder to move
 * @param {string|null} targetFolderId - The ID of the destination folder. If null, moves to root.
 * @returns {Promise<Object>} - Promise resolving to the updated item object
 */
export const moveItem = async (itemId, targetFolderId = null) => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/items/${itemId}/move`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            targetFolderId
          })
        }
    );
  } catch (error) {
    console.error('Error moving item:', error);
    throw error;
  }
};

/**
 * Moves a file to trash
 * @param {string} fileId - The ID of the file to move to trash
 * @returns {Promise<Object>} - Promise resolving to success status
 */
export const moveFileToTrash = async (fileId) => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/files/${fileId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error moving file to trash:', error);
    throw error;
  }
};

/**
 * Moves a folder to trash
 * @param {string} folderId - The ID of the folder to move to trash
 * @returns {Promise<Object>} - Promise resolving to success status
 */
export const moveFolderToTrash = async (folderId) => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/folders/${folderId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error moving folder to trash:', error);
    throw error;
  }
};

/**
 * Fetches all starred items (files and folders)
 * @returns {Promise<Array>} - Promise resolving to an array of starred file and folder objects
 */
export const fetchStarredItems = async () => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/items/starred`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error fetching starred items:', error);
    throw error;
  }
};

/**
 * Fetches recently accessed items (files and folders)
 * @returns {Promise<Array>} - Promise resolving to an array of recent file and folder objects
 */
export const fetchRecentItems = async () => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/items/recent`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error fetching recent items:', error);
    throw error;
  }
};

/**
 * Marks an item as starred
 * @param {string} itemId - The ID of the item to star
 * @returns {Promise<Object>} - Promise resolving to success status
 */
export const starItem = async (itemId) => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/items/${itemId}/star`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error starring item:', error);
    throw error;
  }
};

/**
 * Removes starred status from an item
 * @param {string} itemId - The ID of the item to unstar
 * @returns {Promise<Object>} - Promise resolving to success status
 */
export const unstarItem = async (itemId) => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/items/${itemId}/star`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error unstarring item:', error);
    throw error;
  }
};

/**
 * Fetches user storage information
 * @returns {Promise<Object>} - Promise resolving to user storage information
 */
export const fetchUserStorage = async () => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/users/storage`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error fetching user storage information:', error);
    throw error;
  }
};

/**
 * Fetches items in trash
 * @returns {Promise<Array>} - Promise resolving to an array of trashed file and folder objects
 */
export const fetchTrashItems = async () => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/items/trash`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error fetching trash items:', error);
    throw error;
  }
};

/**
 * Empties the trash (permanently deletes all items in trash)
 * @returns {Promise<Object>} - Promise resolving to success status
 */
export const emptyTrash = async () => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/trash/empty`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error emptying trash:', error);
    throw error;
  }
};

/**
 * Restores all items in trash
 * @returns {Promise<Object>} - Promise resolving to success status
 */
export const restoreAllTrash = async () => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/trash/restore`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error restoring all trash items:', error);
    throw error;
  }
};

/**
 * Permanently deletes a file
 * @param {string} fileId - The ID of the file to permanently delete
 * @returns {Promise<Object>} - Promise resolving to success status
 */
export const permanentDeleteFile = async (fileId) => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/files/${fileId}/permanent`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error permanently deleting file:', error);
    throw error;
  }
};

/**
 * Permanently deletes a folder
 * @param {string} folderId - The ID of the folder to permanently delete
 * @returns {Promise<Object>} - Promise resolving to success status
 */
export const permanentDeleteFolder = async (folderId) => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/folders/${folderId}/permanent`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error permanently deleting folder:', error);
    throw error;
  }
};

/**
 * Restores a file from trash
 * @param {string} fileId - The ID of the file to restore
 * @returns {Promise<Object>} - Promise resolving to success status
 */
export const restoreFile = async (fileId) => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/files/${fileId}/restore`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error restoring file:', error);
    throw error;
  }
};

/**
 * Restores a folder from trash
 * @param {string} folderId - The ID of the folder to restore
 * @returns {Promise<Object>} - Promise resolving to success status
 */
export const restoreFolder = async (folderId) => {
  try {
    return await fetchWithRetry(
        `${apiConfig.baseUrl}/api/folders/${folderId}/restore`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
  } catch (error) {
    console.error('Error restoring folder:', error);
    throw error;
  }
};
