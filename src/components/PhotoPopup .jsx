import React, { useEffect, useRef } from 'react';

export const PhotoPopup = ({ photoSrc, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div ref={popupRef} className="  relative bg-white p-4 rounded-lg shadow-lg max-w-lg max-h-screen w-[90%] sm:w-full h-[80%] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black text-2xl font-bold hover:text-red-500"
        >
          &times;
        </button>
        <div className="flex items-center justify-center h-full">
          <img src={photoSrc} alt="Post" className="w-full max-h-full rounded-lg object-contain" />
        </div>
      </div>
    </div>
  );
};
