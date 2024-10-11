// src/components/EditEventModal.tsx
import { useState, useEffect } from 'react';
import { useScheduleContext } from '../context/ScheduleContextProvider';
import Modal from './Modal';

const EditEventModal = () => {
  const {
    isEditEventModalOpen,
    setIsEditEventModalOpen,
    selectedEvent,
    handleEditEvent,
  } = useScheduleContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null); // State for image upload

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title || '');
      setDescription(selectedEvent.extendedProps?.description || ''); // Optional field
    }
  }, [selectedEvent]);

  const handleSave = () => {
    handleEditEvent({ title, extendedProps: { description, image } });
    setIsEditEventModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <Modal
      deleteButton
      isOpen={isEditEventModalOpen}
      onClose={() => {
        setIsEditEventModalOpen(false)
        setTitle('')
        setDescription('')
        setImage(null)
      }}
      onSave={handleSave}
      title="Edit Event"
    >
      <label className="block mb-2">
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </label>

      <label className="block mb-2">
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          rows={4}
        ></textarea>
      </label>

      <label className="block mb-4">
        Event Image:
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full mt-1"
        />
      </label>

      {image && (
        <div className="mt-4">
          <img
            src={URL.createObjectURL(image)}
            alt="Event"
            className="w-full h-auto rounded-md"
          />
        </div>
      )}
    </Modal>
  );
};

export default EditEventModal;