import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, X, Upload, User } from 'lucide-react';

interface StudentProfileUploadProps {
  studentName?: string;
  currentImage?: string;
  onImageConfirm?: (imageData: string) => void;
  onImageRemove?: () => void;
  className?: string;
}

const StudentProfileUpload: React.FC<StudentProfileUploadProps> = ({
  studentName = '',
  currentImage = '',
  onImageConfirm,
  onImageRemove,
  className = ''
}) => {
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate initials for placeholder
  const getInitials = (name: string): string => {
    if (!name) return 'ST';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setShowConfirmation(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const confirmImage = () => {
    if (previewImage) {
      onImageConfirm?.(previewImage);
      setShowConfirmation(false);
      setPreviewImage('');
    }
  };

  const cancelPreview = () => {
    setPreviewImage('');
    setShowConfirmation(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeCurrentImage = () => {
    onImageRemove?.();
    setPreviewImage('');
    setShowConfirmation(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Determine which image to show
  const displayImage = previewImage || currentImage;
  const showPlaceholder = !displayImage;

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Circular Photo Container */}
      <div className="relative">
        <motion.div
          className={`relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 transition-all duration-300 cursor-pointer ${
            isDragging
              ? 'border-purple-500 shadow-lg shadow-purple-500/30'
              : showConfirmation
              ? 'border-yellow-400 shadow-lg shadow-yellow-400/30'
              : currentImage
              ? 'border-purple-400 hover:border-purple-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={triggerFileSelect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Background Image or Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            {showPlaceholder ? (
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-300 mb-1">
                    {getInitials(studentName)}
                  </div>
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 dark:text-purple-400 mx-auto" />
                </div>
              </div>
            ) : (
              <motion.img
                src={displayImage}
                alt="Student profile"
                className="w-full h-full object-cover"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
          </div>

          {/* Hover Overlay */}
          <AnimatePresence>
            {(isHovering || isDragging) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
              >
                <div className="text-center text-white">
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1" />
                  <p className="text-xs sm:text-sm font-medium">
                    {isDragging ? 'Drop here' : 'Upload Photo'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview Indicator */}
          {showConfirmation && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </motion.div>
          )}
        </motion.div>

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Student Name */}
      {studentName && (
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white text-center"
        >
          {studentName}
        </motion.h3>
      )}

      {/* Action Buttons */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="flex space-x-3"
          >
            <motion.button
              onClick={confirmImage}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Check size={16} />
              <span>Confirm</span>
            </motion.button>
            <motion.button
              onClick={cancelPreview}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={16} />
              <span>Cancel</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Instructions or Remove Button */}
      {!showConfirmation && (
        <div className="text-center">
          {currentImage ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click photo to change image
              </p>
              <button
                onClick={removeCurrentImage}
                className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors duration-300"
              >
                Remove Photo
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click or drag to upload photo
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Upload size={14} className="text-purple-500" />
                <span className="text-xs text-purple-500 font-medium">
                  JPG, PNG up to 5MB
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentProfileUpload;