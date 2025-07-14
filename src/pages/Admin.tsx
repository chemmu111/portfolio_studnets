import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Upload, Image } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useProjects } from '../contexts/ProjectContext';

interface ProjectForm {
  student_name: string;
  project_title: string;
  tools_technologies: string;
  category: string;
  linkedin_link?: string;
  github_link?: string;
  live_project_link?: string;
  linkedin_profile_picture?: string;
  main_project_image: string;
  project_video?: string;
}

const Admin: React.FC = () => {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProjectForm>();

  const categories = ['Web Application', 'Automation'];

  const onSubmit = async (data: ProjectForm) => {
    try {
      let imageUrl = data.main_project_image;
      
      // If an image was uploaded, convert it to base64 data URL
      if (selectedImage) {
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(selectedImage);
        });
      }

      const projectData = {
        ...data,
        main_project_image: imageUrl,
        tools_technologies: data.tools_technologies.split(',').map(tech => tech.trim()),
      };

      let success = false;
      if (editingProject) {
        success = await updateProject(editingProject.id, projectData);
      } else {
        success = await addProject(projectData);
      }

      if (success) {
        setShowForm(false);
        setEditingProject(null);
        reset();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setSelectedImage(null);
    setImagePreview(project.main_project_image || '');
    setValue('student_name', project.student_name);
    setValue('project_title', project.project_title);
    setValue('tools_technologies', project.tools_technologies.join(', '));
    setValue('category', project.category || '');
    setValue('linkedin_link', project.linkedin_link || '');
    setValue('github_link', project.github_link || '');
    setValue('live_project_link', project.live_project_link || '');
    setValue('linkedin_profile_picture', project.linkedin_profile_picture || '');
    setValue('main_project_image', project.main_project_image);
    setValue('project_video', project.project_video || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await deleteProject(id);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
    setSelectedImage(null);
    setImagePreview('');
    reset();
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setValue('main_project_image', '');
  };
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-20 sm:pt-24 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4 text-gray-900 dark:text-white bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-400">
              Manage student projects and portfolio content
            </p>
          </div>
          <motion.button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
            <span>Add Project</span>
          </motion.button>
        </motion.div>

        {/* Project Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 dark:bg-gray-900 light:bg-white rounded-xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20 dark:border-purple-500/20 light:border-purple-200 mx-4"
            >
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white dark:text-white light:text-gray-900 pr-4 flex-1">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors duration-300 text-xl flex-shrink-0"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                      Student Name *
                    </label>
                    <input
                      {...register('student_name', { required: 'Student name is required' })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base"
                      placeholder="Enter student name"
                    />
                    {errors.student_name && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.student_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                      Project Title *
                    </label>
                    <input
                      {...register('project_title', { required: 'Project title is required' })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base"
                      placeholder="Enter project title"
                    />
                    {errors.project_title && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.project_title.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 appearance-none cursor-pointer text-sm sm:text-base"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                    Tools/Technologies * (comma-separated)
                  </label>
                  <input
                    {...register('tools_technologies', { required: 'Technologies are required' })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base"
                    placeholder="React, Node.js, MongoDB, etc."
                  />
                  {errors.tools_technologies && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.tools_technologies.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                      LinkedIn Link
                    </label>
                    <input
                      {...register('linkedin_link')}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                      GitHub Link
                    </label>
                    <input
                      {...register('github_link')}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                    Live Project Link
                  </label>
                  <input
                    {...register('live_project_link')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base"
                    placeholder="https://your-project.com"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                    LinkedIn Profile Picture URL
                  </label>
                  <input
                    {...register('linkedin_profile_picture')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base"
                    placeholder="https://example.com/profile.jpg"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-3">
                    Main Project Image *
                  </label>
                  
                  {/* Image Upload Area */}
                  <div className="space-y-3">
                    {imagePreview ? (
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="Project preview"
                          className="w-full h-40 sm:h-48 object-cover rounded-lg border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                          <button
                            type="button"
                            onClick={removeImage}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-300"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-40 sm:h-48 border-2 border-dashed border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 light:hover:border-purple-600 transition-all duration-300 bg-gray-800/20 dark:bg-gray-800/20 light:bg-gray-50">
                        <Image className="w-12 h-12 text-purple-400 dark:text-purple-400 light:text-purple-600 mb-3" />
                        <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 text-center mb-2">
                          Click to upload project image
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    
                    <div className="flex space-x-3">
                      <label
                        htmlFor="image-upload"
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 dark:bg-purple-600/20 light:bg-purple-100 text-purple-300 dark:text-purple-300 light:text-purple-700 rounded-lg cursor-pointer hover:bg-purple-600/30 dark:hover:bg-purple-600/30 light:hover:bg-purple-200 transition-all duration-300 text-sm border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200"
                      >
                        <Upload size={14} />
                        <span>Choose Image</span>
                      </label>
                      
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all duration-300 text-sm border border-red-500/30"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Hidden input for form validation */}
                  <input
                    {...register('main_project_image', { 
                      required: !imagePreview && !selectedImage ? 'Project image is required' : false 
                    })}
                    type="hidden"
                    value={imagePreview}
                  />
                  
                  {errors.main_project_image && !imagePreview && !selectedImage && (
                    <p className="text-red-400 text-xs sm:text-sm mt-2">{errors.main_project_image.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                    Project Video URL (optional)
                  </label>
                  <input
                    {...register('project_video')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base"
                    placeholder="https://youtube.com/watch?v=... (optional)"
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
                  <motion.button
                    type="submit"
                    className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 flex-1 text-sm sm:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={16} className="sm:w-5 sm:h-5" />
                    <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-600 dark:border-gray-600 light:border-gray-300 text-gray-400 dark:text-gray-400 light:text-gray-600 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Projects List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div
              className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-purple-200 dark:border-purple-500/20 hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex space-x-3 sm:space-x-4 flex-1">
                    <img
                      src={project.main_project_image || 'https://via.placeholder.com/100x100?text=Project'}
                      alt={`${project.project_title} project image`}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 bg-gray-100 dark:bg-gray-800"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== 'https://via.placeholder.com/100x100?text=Project') {
                          target.src = 'https://via.placeholder.com/100x100?text=Project';
                        }
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2">{project.project_title}</h3>
                      <p className="text-sm sm:text-base text-purple-700 dark:text-purple-400 mb-2">by {project.student_name}</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                        {project.tools_technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-purple-600/20 dark:bg-purple-600/20 light:bg-purple-100 text-purple-300 dark:text-purple-300 light:text-purple-700 rounded text-xs border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 whitespace-nowrap"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-700 dark:text-gray-400">
                        <span>❤️ {project.likes_count}</span>
                        <span>💬 {project.comments_count}</span>
                        <span className="hidden sm:inline">📅 {new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 justify-end sm:justify-start">
                    <motion.button
                      onClick={() => handleEdit(project)}
                      className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg transition-all duration-300 flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit size={14} className="sm:w-4 sm:h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-all duration-300 flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;