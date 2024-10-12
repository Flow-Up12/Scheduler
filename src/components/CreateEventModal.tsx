import { useScheduleContext } from "../context/ScheduleContextProvider";
import Modal from "./Modal";
import {
  Form,
  TextInput,
  TextAreaInput,
} from "mj-react-form-builder";

const CreateEventModal = () => {
  const {
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
    handleCreateEvent,
  } = useScheduleContext();

  const handleSave = (data: {
    title: string;
    description: string;
    image: File | null;
  }) => {
    const { title, description } = data;
    handleCreateEvent({
      title,
      description,
      // image,
      location: "",
    });
    setIsCreateEventModalOpen(false);
  };

  return (
    <Modal
      onClose={() => setIsCreateEventModalOpen(false)}
      isOpen={isCreateEventModalOpen}
      title="Create Event"
    >
      <Form
        onSubmit={(data) => handleSave(data as any)}
        defaultValues={{
          title: "",
          description: "",
          image: null,
        }}
      >
        <div className="mb-4">
          <TextInput source="title" label="Title" />
        </div>

        <div className="mb-4">
          <TextAreaInput source="description" label="Description" rows={4} />
        </div>

        <div className="mb-4">
          {/* <FileInput source="image" label="Event Image" /> */}
          <TextInput source="location" label="Location" />
        </div>

        <div className="flex justify-end p-3">
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
              onClick={() => setIsCreateEventModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateEventModal;
