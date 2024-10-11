// src/components/Modal.tsx
import React from "react";
import { useScheduleContext } from "../context/ScheduleContextProvider";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  children: React.ReactNode;
  deleteButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  children,
  deleteButton = false,
}) => {
  if (!isOpen) return null;

  const { handleDeleteEvent } = useScheduleContext();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-4 text-white hover:text-gray-600 focus:outline-none text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-white bg-black p-2">
          {title}
        </h2>

        {/* Modal Content */}
        <div className="p-3">{children}</div>

        {/* Modal Actions */}
        <div className="flex justify-between p-3">
          {/* Placeholder div for spacing if delete button doesn't exist */}
          <div className="flex-grow">
            {deleteButton && (
              <button
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={handleDeleteEvent}
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;