import React, { useState, useEffect } from 'react';
import { useAuth } from '../helpers/AuthProvider';
import { Form, TextInput, FileInput, useNotify } from 'mj-react-form-builder';
import Loading from '../components/Loading';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; 
import FirestoreController from '../helpers/FirebaseController';
import { FormattedFile } from '../types/types';

const organizationController = new FirestoreController('organizations');
const storage = getStorage(); 

// Define the interface for organization data
interface OrganizationProfile {
  organizationName: string;
  organizationEmail: string;
  organizationLogo: FormattedFile[] | string | null;
}

const RegisterOrganization: React.FC = () => {
  const { currentUser } = useAuth(); // Use the logged-in user's details
  const { notify } = useNotify(); // Notification system
  const [isLoading, setIsLoading] = useState(false);
  const [organizationExists, setOrganizationExists] = useState(false); // New state to track if organization exists

  // Default values state typed with OrganizationProfile
  const [defaultValues, setDefaultValues] = useState<OrganizationProfile>({
    organizationName: "",
    organizationEmail: currentUser?.email || "",
    organizationLogo: null,
  });

  // Fetch organization data to preload the form
  const fetchOrganizationData = async () => {
    if (currentUser) {
      setIsLoading(true);
      try {
        const organizationData = await organizationController.getById(currentUser.uid);
        if (organizationData) {
          setOrganizationExists(true); // Organization found, set the state
          // Update default values with fetched organization data
          setDefaultValues({
            organizationName: organizationData.organizationName || "",
            organizationEmail: organizationData.organizationEmail || currentUser.email || "",
            organizationLogo: organizationData.organizationLogo
              ? ([transformFile(organizationData.organizationLogo)] as unknown as FormattedFile[])
              : null,
          });
        } else {
          setOrganizationExists(false); // No organization found
        }
      } catch (error: any) {
        notify(`Failed to fetch organization data: ${error.message}`, "error");
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationData();
  }, [currentUser]);

  // Transform file to FormattedFile type
  const transformFile = (file: string): FormattedFile => {
    return {
      rawFile: new File([], file), // Creating a dummy File instance
      src: file,
      title: file,
    };
  };

  // Upload organization logo to Firebase Storage and return the download URL
  const uploadLogoToStorage = (file: FormattedFile) => {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        return reject('No file provided');
      }
      const storageRef = ref(storage, `logos/${currentUser?.uid}_${file.title}`);
      const uploadTask = uploadBytesResumable(storageRef, file.rawFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          reject(error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Form submit handler
  const handleFormSubmit = async (data: OrganizationProfile) => {
    setIsLoading(true);

    try {
      let logoUrl = data.organizationLogo as string;

      if (data.organizationLogo && typeof data.organizationLogo === 'object') {
        const file = (data.organizationLogo as FormattedFile[])[0];
        logoUrl = await uploadLogoToStorage(file);
      }

      // Create or update the organization document
      const newOrganization = {
        leader: currentUser?.uid, // Leader is the current user's ID
        organizationName: data.organizationName,
        organizationLogo: logoUrl, // Use the URL from Firebase Storage
        organizationEmail: data.organizationEmail,
        status: 'pending', // Set the status to pending
      };

      await organizationController.upsert(currentUser?.uid!, newOrganization);
      notify('Organization registered successfully!', 'success');
    } catch (error: any) {
      notify(`Failed to register organization: ${error.message}`, 'error');
      console.error(error);
    }

    setIsLoading(false);
  };

  return  isLoading ? (
    <Loading />
  ) : (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        {/* Dynamically change title based on whether the organization exists */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          {organizationExists ? "Organization" : "Register Organization"}
        </h2>

        <Form onSubmit={(data) => handleFormSubmit(data as OrganizationProfile)} defaultValues={defaultValues}>
          {/* Organization Name */}
          <TextInput source="organizationName" label="Organization Name" />

          {/* Organization Email */}
          <TextInput source="organizationEmail" label="Organization Email" type="email" />

          {/* Organization Logo */}
          <FileInput source="organizationLogo" label="Organization Logo" />

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Organization'}
            </button>
          </div>
        </Form>
      </div>

      {isLoading && <Loading />} {/* Loading Indicator */}
    </section>
  );
};

export default RegisterOrganization;