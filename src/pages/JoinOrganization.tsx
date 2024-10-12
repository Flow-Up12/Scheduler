import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNotify, Form, TextInput } from "mj-react-form-builder";
import FirestoreController from "../helpers/FirebaseController";
import Loading from "../components/Loading";

const organizationController = new FirestoreController("organizations");
const userController = new FirestoreController("users");

const JoinOrganization: React.FC = () => {
  const { currentUser } = useAuth();
  const { notify } = useNotify();
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinOrganization = async (data: { joinToken: string }) => {
    setIsLoading(true);
    try {
      const organizations = await organizationController.getAll();
      const organization = organizations.find(
        (org) => org.joinToken === data.joinToken
      );

      if (organization) {
        const updatedUser = { organizationId: organization.id };
        await userController.upsert(currentUser?.uid!, updatedUser); // Add the organization ID to the user
        notify("Successfully joined the organization!", "success");
      } else {
        notify("Invalid token. Organization not found.", "error");
      }
    } catch (error: any) {
      notify(`Failed to join organization: ${error.message}`, "error");
    }
    setIsLoading(false);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Join Organization</h2>
        <Form onSubmit={(data) => handleJoinOrganization(data as any)}>
          <TextInput source="joinToken" label="Organization Token" />
          <div className="mt-6">
            <button type="submit" className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-500">
              {isLoading ? "Joining..." : "Join Organization"}
            </button>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default JoinOrganization;