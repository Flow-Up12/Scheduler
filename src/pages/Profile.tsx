import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { useAuth } from "../helpers/AuthProvider";
import { Form, TextInput, useNotify, FileInput } from "mj-react-form-builder";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import FirestoreController from "../helpers/FirebaseController";
import { FormattedFile } from "../types/types";

const userController = new FirestoreController("users");
const storage = getStorage(); // Firebase storage for photo uploads

// Define the type interface for user profile data
interface UserProfile {
  firstName: string;
  lastName: string;
  photoURL: FormattedFile[] | null | string | any;
  email: string;
}

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { notify } = useNotify();
  const [isLoading, setIsLoading] = useState(false);

  // Default values state typed with the UserProfile interface
  const [defaultValues, setDefaultValues] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    photoURL: null,
    email: currentUser?.email || "",
  });

  const transformFile = (file: File) => {
    const transformedFile = {
      rawFile: file,
      src: file,
      title: file,
    };
    return transformedFile;
  };

  // Fetch user data to populate the form
  const fetchUserData = async () => {
    if (currentUser) {
      setIsLoading(true);
      try {
        const userData = await userController.getById(currentUser.uid);
        if (userData) {
          // Update default values with fetched data
          setDefaultValues({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            photoURL: userData.photoURL ([transformFile(userData.photoURL)]) || null,
            email: userData.email || currentUser.email || "",
          });
        }
      } catch (error: any) {
        notify(`Failed to fetch user data: ${error.message}`, "error");
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [currentUser]);

  // Upload profile photo to Firebase Storage and return the URL
  const uploadProfilePhoto = (file: FormattedFile) => {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(
        storage,
        `profile_photos/${currentUser?.uid}_${file.title}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file.rawFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => reject(error.message),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const onSubmit = async (data: UserProfile) => {
    setIsLoading(true);

    try {
      let photoURL = data.photoURL;

      if (data.photoURL && typeof data.photoURL === "object" && data.photoURL) {
        const file = data.photoURL;
        photoURL = await uploadProfilePhoto(file[0]); // Upload photo and get URL
      }

      const updatedUser = {
        firstName: data.firstName,
        lastName: data.lastName,
        photoURL,
        email: data.email,
      };

      await userController.upsert(currentUser?.uid!, updatedUser);
      notify("Profile updated successfully", "success");
      await fetchUserData();
    } catch (error: any) {
      notify(`Profile update failed: ${error.message}`, "error");
      console.error(error);
    }

    setIsLoading(false);
  };

  console.log(defaultValues);

  return isLoading ? (
    <Loading />
  ) : (
    <section
      id="profile"
      className="flex items-center justify-center min-h-screen bg-gray-900"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>
        <Form
          onSubmit={(data) => onSubmit(data as UserProfile)}
          defaultValues={defaultValues}
        >
          <TextInput source="firstName" label="First Name" />
          <TextInput source="lastName" label="Last Name" />
          <TextInput source="email" label="Email" type="email" />
          <FileInput source="photoURL" label="Profile Photo" />

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Form>
      </div>
      {isLoading && <Loading />}
    </section>
  );
};

export default ProfilePage;
