// components/AuthForm.jsx
import { useState } from 'react';
import Loading from '../components/Loading';

import { Form, TextInput, useNotify } from "mj-react-form-builder";

// import IconButton from '@mui/material/IconButton';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../helpers/AuthProvider';
import ResetPasswordButton from '../components/ResetPasswordButton';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, resetPassword, signInWithGoogle } = useAuth();
  const { notify } = useNotify();
  const navigate = useNavigate();

  const handleFormSubmit = async (data : any) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(data.email, data.password);
        notify('Login successful', 'success');
        navigate('/profile');

      } else {
        await signup(data.email, data.password);
        notify('Registration successful', 'success');
        navigate('/profile');
      }
    } catch (error: any) {
      notify(isLogin ? `Login failed: ${error.message}` : `Registration failed: ${error.message}`, 'error');
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      notify('Login successful', 'success');
      navigate('/schedule');
    } catch (error: any) {
      notify(`Login with Google failed: ${error.message}`, 'error');
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (email: string) => {
    if (!email) {
      notify('Please enter your email address.', 'warning');
      console.error("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email);
      notify('Password reset email sent.', 'success');
      console.log("Password reset email sent.");
    } catch (error: any) {
      notify(`Password reset failed: ${error.message}`, 'error');
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <section id="auth" className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 px-4 py-2 ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Log In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 px-4 py-2 ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Sign Up
          </button>
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full px-4 py-2 mb-2 flex items-center justify-center text-white bg-blue-600 rounded hover:bg-blue-500"
          disabled={isLoading}
        >
          <GoogleIcon className="mr-2" /> Log in with Google
        </button>
        {/* <button
          className="w-full px-4 py-2 mb-2 flex items-center justify-center text-white bg-blue-800 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          <FacebookIcon className="mr-2" /> Log in with Facebook
        </button>
        <button
          className="w-full px-4 py-2 mb-4 flex items-center justify-center text-white bg-blue-400 rounded hover:bg-blue-300"
          disabled={isLoading}
        >
          <TwitterIcon className="mr-2" /> Log in with Twitter
        </button> */}
        <div className="text-center text-gray-500 mb-4">or</div>
        <Form onSubmit={handleFormSubmit}>
          <TextInput source="email" label="Email" type="email" />
          <TextInput source="password" label="Password" type="password" />
          {isLogin && (
            <ResetPasswordButton handleResetPassword={handleResetPassword} isLoading={isLoading} />
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-500"
            disabled={isLoading}
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </Form>
      </div>
      {isLoading && <Loading />}
    </section>
  );
}

export default AuthForm;