import { useState } from "react";
import Loading from "../components/Loading";
import { useNotify, Form, TextInput, FileInput } from "mj-react-form-builder";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { FormattedFile } from "../types/types";
import FirestoreController from "../helpers/FirebaseController";
import { useUserContext } from "../context/UserContextProvider";
import { useAuth } from "../context/AuthProvider";

const userController = new FirestoreController("users");
const storage = getStorage(); // Firebase storage for photo uploads

interface UserProfile {
  firstName: string;
  lastName: string;
  photoURL: FormattedFile[] | null | string | any;
  email: string;
}

const ProfilePage: React.FC = () => {
  const { user, refetchUser } = useUserContext(); 
  const { currentUser } = useAuth();
  const { notify } = useNotify();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: UserProfile = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    photoURL: user?.photoURL
      ? [
          {
            rawFile: new File([], user.photoURL),
            src: user.photoURL,
            title: user.photoURL,
          },
        ]
      : null,
    email: user?.email || "",
  };

  const uploadProfilePhoto = (file: FormattedFile) => {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(
        storage,
        `profile_photos/${user?.uid}_${file.title}`
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

      if (
        data.photoURL &&
        typeof data.photoURL === "object" &&
        data.photoURL[0].src !== data.photoURL[0].title
      ) {
        const file = (data.photoURL as FormattedFile[])[0];
        photoURL = await uploadProfilePhoto(file);
      } else {
        photoURL = data.photoURL && typeof data.photoURL === "object"
          ? data.photoURL[0].src
          : null;
      }

      const updatedUser = {
        firstName: data.firstName,
        lastName: data.lastName,
        photoURL,
        email: data.email,
      };

      await userController.upsert(currentUser?.uid!, updatedUser); 
      
      notify("Profile updated successfully", "success");

      await refetchUser();
      
    } catch (error: any) {
      notify(`Profile update failed: ${error.message}`, "error");
      console.error(error);
    }

    setIsLoading(false);
  };

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
    </section>
  );
};

export default ProfilePage;