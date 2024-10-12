import { useState, useEffect } from "react";
import { useScheduleContext } from "../context/ScheduleContextProvider";
import Modal from "./Modal";
import { TextInput, TextAreaInput, Form } from "mj-react-form-builder";

const EditEventModal = () => {
  const {
    isEditEventModalOpen,
    setIsEditEventModalOpen,
    selectedEvent,
    handleEditEvent,
    handleDeleteEvent,
  } = useScheduleContext();

  // State to track whether we are in view or edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Default to view mode when modal opens
  useEffect(() => {
    if (isEditEventModalOpen) {
      setIsEditing(false);
    }
  }, [isEditEventModalOpen]);

  const handleSave = (data: {
    title: string;
    description: string;
    location: string;
    image: File | null;
  }) => {
    const { title, description, location, image } = data;
    handleEditEvent({
      title,
      extendedProps: {
        description,
        location,
        image,
      },
    });
    setIsEditEventModalOpen(false);
  };

  return (
    <Modal
      onClose={() => setIsEditEventModalOpen(false)}
      isOpen={isEditEventModalOpen}
      title={isEditing ? "Edit Event" : selectedEvent?.title || "Event Details"}
    >
      {isEditing ? (
        <Form
          onSubmit={(data) => handleSave(data as any)}
          defaultValues={{
            title: selectedEvent?.title || "",
            description: selectedEvent?.extendedProps?.description || "",
            location: selectedEvent?.extendedProps?.location || "",
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
            <TextInput source="location" label="Location" />
          </div>

          <div className="flex justify-between p-3">
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
                onClick={() => setIsEditing(false)}
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
      ) : (
        <div className="p-2">
       
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md">
              {selectedEvent?.extendedProps?.description ||
                "No Description Available"}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Location
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md">
              {selectedEvent?.extendedProps?.location || "No Location Provided"}
            </p>
          </div>

          {selectedEvent?.extendedProps?.image && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Event Image
              </label>
              <img
                src={URL.createObjectURL(selectedEvent.extendedProps.image)}
                alt="Event"
                className="w-full h-auto rounded-md"
              />
            </div>
          )}

          <div className="flex justify-end p-2">
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={() => setIsEditing(true)} // Switch to edit mode
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EditEventModal;
