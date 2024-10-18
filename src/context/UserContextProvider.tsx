import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FirestoreController from '../helpers/FirebaseController';
import Loading from '../components/Loading';
import { useAuth } from './AuthProvider';

// Firestore controller to access the "users" collection
const userController = new FirestoreController('users');

// Define the user context types
interface UserContextProps {
  user: any | null;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth(); 
  const [user, setUser] = useState<any | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data from Firestore
  const fetchUserData = async () => {
    if (currentUser) {
      try {
        const userData = await userController.getById(currentUser.uid);
        if (userData) {
          setUser(userData); 
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        navigate('/login');
      }
    } 
    setIsLoading(false);
  };

  const refetchUser = async () => {
    setIsLoading(true);
    await fetchUserData();
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  },  [currentUser]);

  if (isLoading || (!user && currentUser)) {
    return <Loading />; 
  }

  return (
    <UserContext.Provider value={{ user, isLoading, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
};