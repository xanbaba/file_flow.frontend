import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Create the context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = useCallback((notification) => {
    const id = Date.now(); // Simple unique ID
    const newNotification = {
      id,
      time: 'Just now',
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return id;
  }, []);

  // Update an existing notification
  const updateNotification = useCallback((id, updates) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, ...updates } 
          : notification
      )
    );
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Update the "time ago" for all notifications periodically
  useEffect(() => {
    const updateTimes = () => {
      setNotifications(prev => 
        prev.map(notification => {
          if (notification.timestamp) {
            const secondsAgo = Math.floor((Date.now() - notification.timestamp) / 1000);
            let timeAgo;
            
            if (secondsAgo < 60) {
              timeAgo = 'Just now';
            } else if (secondsAgo < 3600) {
              const minutes = Math.floor(secondsAgo / 60);
              timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            } else if (secondsAgo < 86400) {
              const hours = Math.floor(secondsAgo / 3600);
              timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else {
              const days = Math.floor(secondsAgo / 86400);
              timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
            }
            
            return { ...notification, time: timeAgo };
          }
          return notification;
        })
      );
    };

    const intervalId = setInterval(updateTimes, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);

  // Value object to be provided to consumers
  const value = {
    notifications,
    addNotification,
    updateNotification,
    removeNotification,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;