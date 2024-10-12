import { useScheduleContext } from "../context/ScheduleContextProvider";
import Modal from "./Modal";
import {
  TextInput,
  TextAreaInput,
  Form,
} from "mj-react-form-builder";

const EditEventModal = () => {
  const {
    isEditEventModalOpen,
    setIsEditEventModalOpen,
    selectedEvent,
    handleEditEvent,
    handleDeleteEvent,
  } = useScheduleContext();

  const handleSave = (data: {
    title: string;
    description: string;
    image: File | null;
  }) => {
    const { title, description, image } = data;
    handleEditEvent({
      title,
      extendedProps: {
        description,
        image,
      },
    });
    setIsEditEventModalOpen(false);
  };

  return (
    <Modal
      onClose={() => setIsEditEventModalOpen(false)}
      isOpen={isEditEventModalOpen}
      title="Edit Event"
    >
      <Form
        onSubmit={(data) => handleSave(data as any)}
        defaultValues={{
          title: selectedEvent?.title || "",
          description: selectedEvent?.extendedProps?.description || "",
          location: selectedEvent?.extendedProps.description || "",
        }}
      >
        <div className="mb-4">
          <TextInput source="title" label="Title" />
        </div>

        <div className="mb-4">
          <TextAreaInput source="description" label="Description" rows={4} />
        </div>

        <div className="mb-4">
          <TextInput source="location" label="Location" />
        </div>

        <div className="flex justify-between p-3">
          {/* Placeholder div for spacing if delete button doesn't exist */}
          <div className="flex-grow">
            <button
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              onClick={() => handleDeleteEvent()}
            >
              Delete
            </button>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
              onClick={() => setIsEditEventModalOpen(false)}
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

export default EditEventModal;
