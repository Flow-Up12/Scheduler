import { useFormContext } from "react-hook-form";

const ResetPasswordButton = ({ handleResetPassword, isLoading }: { handleResetPassword: (email: string) => void, isLoading: boolean }) => {

  const {getValues} = useFormContext();

  return (
    <div className="text-right mb-4">
      <button
        type="button"
        onClick={() => handleResetPassword(getValues("email"))}
        className="text-blue-600 hover:underline"
        disabled={isLoading}
      >
        Don't remember your password?
      </button>
    </div>
  );
};

export default ResetPasswordButton;
