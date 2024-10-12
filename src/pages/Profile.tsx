// components/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Loading from '../components/Loading';
import FirestoreController from '../helpers/FirebaseController';
import { useAuth } from '../helpers/AuthProvider';
import { Form, TextInput, useNotify } from 'mj-react-form-builder';

const userController = new FirestoreController('users');

function ProfilePage() {
  const { currentUser, updateProfile } = useAuth();
  const { notify } = useNotify();
  const methods = useForm();
  const { reset, handleSubmit } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({ displayName: '', email: '' });


  const fetchUserData = async () => {
    if (currentUser) {
      setIsLoading(true);
      try {
        const userData = await userController.getById(currentUser.uid);
        if (userData) {
          setDefaultValues({
            displayName: userData.displayName,
            email: userData.email,
          });
          reset(userData);
        }
      } catch (error: any) {
        notify(`Failed to fetch user data: ${error.message}`, 'error');
      }
      setIsLoading(false);
    }
  }


  useEffect(() => {
    fetchUserData();
  }, [currentUser]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {

      await updateProfile(data);
      notify('Profile updated successfully', 'success');
      await fetchUserData();  

    } catch (error: any) {
      notify(`Profile update failed: ${error.message}`, 'error');
      console.error(error);
    }
    setIsLoading(false);
  };

  return isLoading ? <Loading /> : (
    <section id="profile" className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>
        <Form onSubmit={async (data)  => handleSubmit(await onSubmit(data))} defaultValues={defaultValues} >
          <TextInput source="displayName" label="Display Name" />
          <TextInput source="email" label="Email" type="email" />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-500"
            disabled={isLoading}
          >
            Save Changes
          </button>
        </Form>
      </div>
      {isLoading && <Loading />}
    </section>
  );
}

export default ProfilePage;