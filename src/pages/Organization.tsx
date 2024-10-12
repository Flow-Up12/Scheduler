import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { Form, TextInput, FileInput, useNotify } from "mj-react-form-builder";
import Loading from "../components/Loading";
import { v4 as uuidv4 } from "uuid";
import { QRCodeCanvas } from "qrcode.react"; // QR code generator
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import FirestoreController from "../helpers/FirebaseController";
import { FormattedFile } from "../types/types";

const organizationController = new FirestoreController("organizations");
const storage = getStorage();

// Define the interface for organization data
interface OrganizationProfile {
  organizationName: string;
  organizationEmail: string;
  organizationLogo: FormattedFile[] | string | null;
  joinToken: string;
}

const RegisterOrganization: React.FC = () => {
  const { currentUser } = useAuth();
  const { notify } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const [organizationExists, setOrganizationExists] = useState(false);

  // Default values state typed with OrganizationProfile
  const [defaultValues, setDefaultValues] = useState<OrganizationProfile>({
    organizationName: "",
    organizationEmail: currentUser?.email || "",
    organizationLogo: null,
    joinToken: "",
  });

  // Fetch organization data to preload the form
  const fetchOrganizationData = async () => {
    if (currentUser) {
      setIsLoading(true);
      try {
        const organizationData = await organizationController.getById(
          currentUser.uid
        );
        if (organizationData) {
          setOrganizationExists(true); // Organization found, set the state
          // Update default values with fetched organization data
          setDefaultValues({
            organizationName: organizationData.organizationName || "",
            organizationEmail:
              organizationData.organizationEmail || currentUser.email || "",
            organizationLogo: organizationData.organizationLogo
              ? ([
                  transformFile(organizationData.organizationLogo),
                ] as unknown as FormattedFile[])
              : null,
            joinToken: organizationData.joinToken || "",
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
        return reject("No file provided");
      }
      const storageRef = ref(
        storage,
        `logos/${currentUser?.uid}_${file.title}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file.rawFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
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

  // Automatically store the generated token in the Firestore
  const generateToken = async () => {
    const token = uuidv4();
    if (currentUser) {
      await organizationController.update(currentUser.uid, { joinToken: token });
      fetchOrganizationData();
      notify("Token generated and saved successfully", "success");
    }
  };

  // Form submit handler
  const handleFormSubmit = async (data: OrganizationProfile) => {
    setIsLoading(true);

    try {
      let logoUrl = data.organizationLogo;

      if (
        data.organizationLogo &&
        typeof data.organizationLogo === "object" &&
        data.organizationLogo[0].src !== data.organizationLogo[0].title
      ) {
        const file = (data.organizationLogo as FormattedFile[])[0];
        logoUrl = await uploadLogoToStorage(file);
      } else {
        logoUrl =
          data.organizationLogo && typeof data.organizationLogo === "object"
            ? data.organizationLogo[0].src
            : null;
      }

      const newOrganization = {
        leader: currentUser?.uid,
        organizationName: data.organizationName,
        organizationLogo: logoUrl,
        organizationEmail: data.organizationEmail,
        joinToken: defaultValues.joinToken || null,
        status: organizationExists ? "active" : "pending",
      };

      await organizationController.upsert(currentUser?.uid!, newOrganization);

      notify(
        `Organization ${
          organizationExists ? "updated" : "registered"
        } successfully`,
        "success"
      );
    } catch (error: any) {
      notify(`Failed to register organization: ${error.message}`, "error");
      console.error(error);
    }
    await fetchOrganizationData(); // Refetch organization data
    setIsLoading(false);
  };

  const qrCodeUrl = `${import.meta.env.VITE_WEBSITE_URL}login?organizationToken=${defaultValues.joinToken}`;

  return isLoading ? (
    <Loading />
  ) : (
    <section className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        {/* Dynamically change title based on whether the organization exists */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          {organizationExists ? "Organization" : "Register Organization"}
        </h2>

        <Form
          onSubmit={(data) => handleFormSubmit(data as OrganizationProfile)}
          defaultValues={defaultValues}
        >
          {/* Organization Name */}
          <TextInput source="organizationName" label="Organization Name" />

          {/* Organization Email */}
          <TextInput
            source="organizationEmail"
            label="Organization Email"
            type="email"
          />

          {/* Organization Logo */}
          <FileInput source="organizationLogo" label="Organization Logo" />

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Organization"}
            </button>
          </div>
        </Form>

        {organizationExists && (
          <div>
            <h3 className="text-xl font-bold mt-6 text-center">
              Organization Token
            </h3>
            <p className="text-center text-gray-600">
              Share this token with your team to join the organization
            </p>
            {defaultValues.joinToken && (
              <p className="text-center text-blue-600">{defaultValues.joinToken}</p>
            )}
            <button
              onClick={generateToken}
              className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Token"}
            </button>

            {defaultValues.joinToken && (
              <div className="mt-6 flex justify-center">
                <QRCodeCanvas value={qrCodeUrl} size={200} />
              </div>
            )}
          </div>
        )}
      </div>
      {isLoading && <Loading />} {/* Loading Indicator */}
    </section>
  );
};

export default RegisterOrganization;