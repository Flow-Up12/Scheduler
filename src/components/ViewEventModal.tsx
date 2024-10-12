import { useScheduleContext } from "../context/ScheduleContextProvider";
import Modal from "./Modal";

const ViewEventModal = () => {
  const {
    isEditEventModalOpen, 
    setIsEditEventModalOpen,
    selectedEvent,
  } = useScheduleContext();

  return (
    <Modal
      onClose={() => setIsEditEventModalOpen(false)}
      isOpen={isEditEventModalOpen}
      title="View Event"
    >
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <p className="px-3 py-2 border border-gray-300 rounded-md">
            {selectedEvent?.title || "No Title Available"}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <p className="px-3 py-2 border border-gray-300 rounded-md">
            {selectedEvent?.extendedProps?.description || "No Description Available"}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
          <p className="px-3 py-2 border border-gray-300 rounded-md">
            {selectedEvent?.extendedProps?.location || "No Location Provided"}
          </p>
        </div>

        {selectedEvent?.extendedProps?.image && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Event Image</label>
            <img
              src={URL.createObjectURL(selectedEvent.extendedProps.image)}
              alt="Event"
              className="w-full h-auto rounded-md"
            />
          </div>
        )}

        <div className="flex justify-end p-3">
          <button
            className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
            onClick={() => setIsEditEventModalOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewEventModal;