// helpers/NotifyContext.js
import React, { createContext, useContext, useState } from 'react';

interface Notification {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotifyContextType {
  notify: (message: string, type?: Notification['type']) => void;
}

const NotifyContext = createContext<NotifyContextType>({
  notify: () => {},
});

export const useNotify = () => {
  return useContext(NotifyContext);
};

export const NotifyProvider = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const notify = (message, type = 'info' as Notification['type']) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
  };

  return (
    <NotifyContext.Provider value={{ notify }}>
      {children}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <style>{`
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 30px;
          border-radius: 8px;
          color: white;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          animation: slide-in 0.3s ease-out, fade-out 0.3s ease-out 2.7s;
        }
        .notification.info {
          background-color: #2196f3;
        }
        .notification.success {
          background-color: #4caf50;
        }
        .notification.warning {
          background-color: #ff9800;
        }
        .notification.error {
          background-color: #f44336;
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </NotifyContext.Provider>
  );
};