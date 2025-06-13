import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropUtils'; // Your cropping utility that returns Blob
import { motion } from 'framer-motion';

const CropModal = ({ image, onClose, onCropComplete, role = 'user' }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Called by react-easy-crop when crop area changes
  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Called on Crop & Save click
  const handleDone = async () => {
    try {
      setIsProcessing(true);
      // Get cropped image Blob from utility
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      // Convert Blob to a URL string usable as image src
      const croppedImageUrl = URL.createObjectURL(croppedBlob);
      // Pass cropped image URL to parent
      await onCropComplete(croppedImageUrl);
    } catch (err) {
      console.error(`❌ Crop failed (${role}):`, err);
      alert('Failed to crop image, please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-lg shadow-xl relative">
        <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">
          Crop Your {role === 'admin' ? 'Admin' : 'User'} Profile Image
        </h2>

        <div className="relative w-full h-72 bg-gray-100 rounded overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        {isProcessing && (
          <div className="text-blue-600 font-medium text-center my-4 animate-pulse">
            ⏳ Processing image, please wait...
          </div>
        )}

        <div className="flex justify-between mt-5">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={isProcessing}
          >
            Crop & Save
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CropModal;
