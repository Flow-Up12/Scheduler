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

// Organization Info Component
const OrganizationInfo: React.FC<{
  defaultValues: OrganizationProfile;
  handleFormSubmit: (data: OrganizationProfile) => Promise<void>;
  isLoading: boolean;
}> = ({ defaultValues, handleFormSubmit, isLoading }) => (
  <div className="bg-white rounded-lg shadow-xl p-8">
    <h3 className="text-2xl font-bold mb-6 text-center">Organization Info</h3>
    <Form
      onSubmit={(data) => handleFormSubmit(data as OrganizationProfile)}
      defaultValues={defaultValues}
    >
      <TextInput source="organizationName" label="Organization Name" />
      <TextInput
        source="organizationEmail"
        label="Organization Email"
        type="email"
      />
      <FileInput source="organizationLogo" label="Organization Logo" />
      <div className="mt-6">
        <button
          type="submit"
          className="w-full px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
        >
          {isLoading ? "Saving..." : "Save Organization"}
        </button>
      </div>
    </Form>
  </div>
);

// Token Generation Component
const TokenGeneration: React.FC<{
  defaultValues: OrganizationProfile;
  generateToken: () => Promise<void>;
  isLoading: boolean;
}> = ({ defaultValues, generateToken, isLoading }) => {
  const qrCodeUrl = `${import.meta.env.VITE_WEBSITE_URL}login?organizationToken=${defaultValues.joinToken}`;

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">
        Organization Token
      </h3>
      <p className="text-center text-gray-600">
        Share this token with your team to join the organization
      </p>
      {defaultValues.joinToken && (
        <p className="text-center text-blue-600 mt-4 break-words">
          {defaultValues.joinToken}
        </p>
      )}
      <button
        onClick={generateToken}
        className="w-full mt-4 px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-500"
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Token"}
      </button>

      {defaultValues.joinToken && (
        <div className="mt-6 flex justify-center">
          <QRCodeCanvas value={qrCodeUrl} size={180} />
        </div>
      )}
    </div>
  );
};

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
      rawFile: new File([], file),
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
      await organizationController.update(currentUser.uid, {
        joinToken: token,
      });
      fetchOrganizationData();
      notify("Token generated and saved successfully", "success");
    }
  };

  // Form submit handler
  const handleFormSubmit = async (data: OrganizationProfile) => {
    setIsLoading(true);

    try {
      let logoUrl = data.organizationLogo;
      console.log(data.organizationLogo);
      if (
        data.organizationLogo &&
        typeof data.organizationLogo[0] === "object" &&
        data.organizationLogo[0].src !== data.organizationLogo[0].title
      ) {
        const file = (data.organizationLogo as FormattedFile[])[0];
        logoUrl = await uploadLogoToStorage(file);
      } else {
        logoUrl =
          data.organizationLogo && typeof data.organizationLogo[0] === "object"
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
    await fetchOrganizationData();
    setIsLoading(false);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <section className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Left Side - Organization Info */}
        <OrganizationInfo
          defaultValues={defaultValues}
          handleFormSubmit={handleFormSubmit}
          isLoading={isLoading}
        />

        {/* Right Side - Token Generation */}
        {organizationExists && (
          <TokenGeneration
            defaultValues={defaultValues}
            generateToken={generateToken}
            isLoading={isLoading}
          />
        )}
      </div>
    </section>
  );
};

export default RegisterOrganization;
