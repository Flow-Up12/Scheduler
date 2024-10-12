// src/components/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  deleteButton?: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white hover:text-gray-600 focus:outline-none text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-white bg-black p-3">
          {title}
        </h2>

        <div className="p-3">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
