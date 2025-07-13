import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Calendar, User } from 'lucide-react';

interface ImageUploadCardProps {
  title?: string;
  creatorName?: string;
  date?: string;
  onImageChange?: (file: File | null) => void;
  onTitleChange?: (title: string) => void;
  onCreatorChange?: (creator: string) => void;
  className?: string;
}

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  title = '',
  creatorName = '',
  date = new Date().toLocaleDateString(),
  onImageChange,
  onTitleChange,
  onCreatorChange,
  className = ''
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        onImageChange?.(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
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

  const removeImage = () => {
    setUploadedImage(null);
    onImageChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-200 dark:border-purple-500/20 hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 ${className}`}
    >
      {/* Image Upload Area */}
      <div className="relative">
        {uploadedImage ? (
          <div className="relative group">
            <motion.img
              src={uploadedImage}
              alt="Uploaded project"
              className="w-full h-40 sm:h-48 object-cover"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <motion.button
                onClick={removeImage}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={16} />
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.div
            className={`w-full h-40 sm:h-48 border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
              isDragging
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-purple-300 dark:border-purple-500/50 hover:border-purple-500 dark:hover:border-purple-500'
            }`}
            onClick={triggerFileSelect}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="text-purple-400 dark:text-purple-400 mb-2"
              animate={{ y: isDragging ? -5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Upload size={32} />
            </motion.div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center px-4">
              {isDragging ? 'Drop image here' : 'Click to upload or drag & drop'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB
            </p>
          </motion.div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-6">
        {/* Title Input */}
        <div className="mb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange?.(e.target.value)}
            placeholder="Enter project title..."
            className="w-full text-base sm:text-lg font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-400 rounded px-2 py-1 transition-all duration-300"
          />
        </div>

        {/* Creator Input */}
        <div className="flex items-center space-x-2 mb-3">
          <User size={14} className="text-purple-400 dark:text-purple-400 flex-shrink-0" />
          <input
            type="text"
            value={creatorName}
            onChange={(e) => onCreatorChange?.(e.target.value)}
            placeholder="Creator name..."
            className="flex-1 text-sm bg-transparent border-none outline-none text-purple-600 dark:text-purple-400 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-400 rounded px-2 py-1 transition-all duration-300"
          />
        </div>

        {/* Date Display */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <Calendar size={12} className="flex-shrink-0" />
          <span>{date}</span>
        </div>

        {/* Upload Status */}
        {uploadedImage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs text-center"
          >
            ✓ Image uploaded successfully
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ImageUploadCard;