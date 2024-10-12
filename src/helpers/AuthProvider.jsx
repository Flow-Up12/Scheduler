// helpers/AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import FirestoreController from '../helpers/FirebaseController';
import { auth } from '../src/firebase';

const AuthContext = createContext();
const userController = new FirestoreController('/users'); // Assume 'users' is the Firestore collection for users

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const logout = () => {
    return auth.signOut();
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const updateProfile = async (data) => {
    if (auth.currentUser) {
      await userController.update(auth.currentUser.uid, {
        displayName: data.displayName,
        email: data.email,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        // Create or update the user document in Firestore
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString()
        };
        console.log(userData);
        // await userController.upsert(user.uid, userData);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    resetPassword,
    logout,
    signInWithGoogle,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};