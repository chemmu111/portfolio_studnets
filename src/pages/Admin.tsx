import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Upload, Image } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useProjects } from '../contexts/ProjectContext';
import { SuccessStory } from '../types';
import { supabase } from '../lib/supabase';
import StudentProfileUpload from '../components/StudentProfileUpload';

interface ProjectForm {
  student_name: string;
  project_title: string;
  description: string;
  tools_technologies: string;
  category: string;
  linkedin_link?: string;
  github_link?: string;
  live_project_link?: string;
  main_project_image: string;
  project_video?: string;
}

const Admin: React.FC = () => {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();
  const [activeTab, setActiveTab] = useState<'projects' | 'stories'>('projects');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  
  // Success Stories State
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [linkedinProfilePic, setLinkedinProfilePic] = useState<string>('');
  const [fetchingLinkedinPic, setFetchingLinkedinPic] = useState(false);
  const [imageError, setImageError] = useState<string>('');
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProjectForm>();

  // Student profile image state
  const [studentProfileImage, setStudentProfileImage] = useState<string>('');
  const [currentStudentName, setCurrentStudentName] = useState<string>('');
  
  // Success Story Form
  interface StoryForm {
    student_name: string;
    title: string;
    content: string;
    company?: string;
    position?: string;
    linkedin_link?: string;
    achievement_type: string;
  }
  
  const { register: registerStory, handleSubmit: handleSubmitStory, reset: resetStory, setValue: setValueStory, formState: { errors: storyErrors } } = useForm<StoryForm>();

  const categories = ['Web Application', 'Automation'];
  const achievementTypes = [
    { value: 'job_placement', label: 'Job Placement' },
    { value: 'certification', label: 'Certification' },
    { value: 'promotion', label: 'Promotion' },
    { value: 'startup', label: 'Startup' },
    { value: 'other', label: 'Other' }
  ];

  // Function to extract LinkedIn username from URL
  const extractLinkedInUsername = (url: string): string | null => {
    const patterns = [
      /linkedin\.com\/in\/([^\/\?]+)/,
      /linkedin\.com\/pub\/([^\/\?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Function to fetch LinkedIn profile picture
  const fetchLinkedInProfilePicture = async (linkedinUrl: string) => {
    if (!linkedinUrl) {
      setLinkedinProfilePic('');
      return;
    }

    const username = extractLinkedInUsername(linkedinUrl);
    if (!username) {
      setLinkedinProfilePic('');
      return;
    }

    setFetchingLinkedinPic(true);
    try {
      // Since we can't directly access LinkedIn's API due to CORS and authentication,
      // we'll use a placeholder service that generates profile pictures based on initials
      // In a real application, you would use LinkedIn's API or a backend service
      const fallbackPicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=6366f1&color=ffffff&size=200&rounded=true`;
      setLinkedinProfilePic(fallbackPicture);
    } catch (error) {
      console.error('Error fetching LinkedIn profile picture:', error);
      setLinkedinProfilePic('');
    } finally {
      setFetchingLinkedinPic(false);
    }
  };

  // Watch for LinkedIn URL changes
  const watchLinkedInUrl = (url: string) => {
    fetchLinkedInProfilePicture(url);
  };

  const onSubmit = async (data: ProjectForm) => {
    try {
      // Validate image is present
      if (!imagePreview && !selectedImage) {
        setImageError('Please upload a project image');
        return;
      }
      
      let imageUrl = imagePreview;
      
      // If no preview but we have selected image, use default
      if (!imageUrl && !selectedImage) {
        imageUrl = 'https://via.placeholder.com/600x400/6366f1/ffffff?text=Project+Image';
      }

      const projectData = {
        ...data,
        main_project_image: imageUrl,
        linkedin_profile_picture: linkedinProfilePic,
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
        setSelectedImage(null);
        setImagePreview('');
        setImageError('');
        reset();
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setImageError('Failed to save project. Please try again.');
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setSelectedImage(null);
    setImagePreview(project.main_project_image || '');
    setImageError('');
    setLinkedinProfilePic(project.linkedin_profile_picture || '');
    setStudentProfileImage(''); // Reset student profile image for editing
    setCurrentStudentName(project.student_name);
    setValue('student_name', project.student_name);
    setValue('project_title', project.project_title);
    setValue('description', project.description || '');
    setValue('tools_technologies', project.tools_technologies.join(', '));
    setValue('category', project.category || '');
    setValue('linkedin_link', project.linkedin_link || '');
    setValue('github_link', project.github_link || '');
    setValue('live_project_link', project.live_project_link || '');
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
    setImageError('');
    setLinkedinProfilePic('');
    reset();
    setStudentProfileImage('');
    setCurrentStudentName('');
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Reset previous errors
      setImageError('');
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setImageError('Please upload a valid image file (JPG, PNG, or WebP)');
        return;
      }
      
      // Validate file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setImageError('Image size must be less than 2MB');
        return;
      }
      
      // If validation passes, process the file
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setValue('main_project_image', result);
      };
      reader.onerror = () => {
        setImageError('Failed to read the image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setImageError('');
    setValue('main_project_image', '');
    
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle student profile image confirmation
  const handleStudentProfileConfirm = (imageData: string) => {
    setStudentProfileImage(imageData);
  };

  // Handle student profile image removal
  const handleStudentProfileRemove = () => {
    setStudentProfileImage('');
  };

  // Watch student name changes for profile component
  const watchStudentName = (name: string) => {
    setCurrentStudentName(name);
  };
  
  // Load Success Stories
  useEffect(() => {
    if (activeTab === 'stories') {
      loadSuccessStories();
    }
  }, [activeTab]);
  
  const loadSuccessStories = async () => {
    try {
      setStoriesLoading(true);
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuccessStories(data || []);
    } catch (error) {
      console.error('Error loading success stories:', error);
      // Mock data for demo
      setSuccessStories([]);
    } finally {
      setStoriesLoading(false);
    }
  };
  
  // Success Story Handlers
  const onSubmitStory = async (data: StoryForm) => {
    try {
      const storyData = {
        ...data,
        student_image: studentProfileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.student_name)}&background=6366f1&color=ffffff&size=200&rounded=true`
      };

      let success = false;
      if (editingStory) {
        const { error } = await supabase
          .from('success_stories')
          .update(storyData)
          .eq('id', editingStory.id);
        success = !error;
      } else {
        const { error } = await supabase
          .from('success_stories')
          .insert([storyData]);
        success = !error;
      }

      if (success) {
        setShowStoryForm(false);
        setEditingStory(null);
        setStudentProfileImage('');
        resetStory();
        loadSuccessStories();
        toast.success(editingStory ? 'Story updated successfully!' : 'Story created successfully!');
      }
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error('Failed to save story');
    }
  };
  
  const handleEditStory = (story: SuccessStory) => {
    setEditingStory(story);
    setStudentProfileImage(story.student_image || '');
    setCurrentStudentName(story.student_name);
    setValueStory('student_name', story.student_name);
    setValueStory('title', story.title);
    setValueStory('content', story.content);
    setValueStory('company', story.company || '');
    setValueStory('position', story.position || '');
    setValueStory('linkedin_link', story.linkedin_link || '');
    setValueStory('achievement_type', story.achievement_type);
    setShowStoryForm(true);
  };
  
  const handleDeleteStory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this success story?')) return;
    
    try {
      const { error } = await supabase
        .from('success_stories')
        .delete()
        .eq('id', id);
        
      if (!error) {
        loadSuccessStories();
        toast.success('Story deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete story');
    }
  };
  
  const handleCancelStory = () => {
    setShowStoryForm(false);
    setEditingStory(null);
    setStudentProfileImage('');
    setCurrentStudentName('');
    resetStory();
  };
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-20 sm:pt-24 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-4"
        >
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-400">
              Manage student projects, success stories and portfolio content
            </p>
          </div>
          <motion.button
            onClick={() => activeTab === 'projects' ? setShowForm(true) : setShowStoryForm(true)}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 text-xs sm:text-sm lg:text-base w-full sm:w-auto min-h-[44px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <span>{activeTab === 'projects' ? 'Add Project' : 'Add Success Story'}</span>
          </motion.button>
        </motion.div>
        
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex space-x-1 bg-gray-100 dark:bg-gray-800/50 rounded-full p-1 mb-6 sm:mb-8 w-fit mx-auto"
        >
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
              activeTab === 'projects'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-700/30'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
              activeTab === 'stories'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-700/30'
            }`}
          >
            Success Stories
          </button>
        </motion.div>

        {/* Project Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 dark:bg-gray-900 light:bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-purple-500/20 dark:border-purple-500/20 light:border-purple-200 mx-2 sm:mx-4 my-2 sm:my-0"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4 lg:mb-6">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white dark:text-white light:text-gray-900 pr-3 sm:pr-4 flex-1">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors duration-300 text-lg sm:text-xl flex-shrink-0 p-1"
                >
                  <X size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 lg:space-y-6">
                {/* Student Profile Section */}
                <div className="bg-gray-800/30 dark:bg-gray-800/30 light:bg-gray-50 rounded-lg p-4 sm:p-6 border border-purple-500/20 dark:border-purple-500/20 light:border-purple-200">
                  <h3 className="text-sm sm:text-base font-semibold text-white dark:text-white light:text-gray-900 mb-4 text-center">
                    Student Profile
                  </h3>
                  <StudentProfileUpload
                    studentName={currentStudentName}
                    currentImage={studentProfileImage}
                    onImageConfirm={handleStudentProfileConfirm}
                    onImageRemove={handleStudentProfileRemove}
                    className="w-full"
                  />
                </div>

                {/* Student Profile Section */}
                <div className="bg-gray-800/30 dark:bg-gray-800/30 light:bg-gray-50 rounded-lg p-4 sm:p-6 border border-purple-500/20 dark:border-purple-500/20 light:border-purple-200">
                  <h3 className="text-sm sm:text-base font-semibold text-white dark:text-white light:text-gray-900 mb-4 text-center">
                    Student Profile
                  </h3>
                  <StudentProfileUpload
                    studentName={currentStudentName}
                    currentImage={studentProfileImage}
                    onImageConfirm={handleStudentProfileConfirm}
                    onImageRemove={handleStudentProfileRemove}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-1 sm:mb-2">
                      Student Name *
                    </label>
                    <input
                      {...register('student_name', { required: 'Student name is required' })}
                      onChange={(e) => { register('student_name').onChange(e); watchStudentName(e.target.value); }}
                      onChange={(e) => { register('student_name').onChange(e); watchStudentName(e.target.value); }}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base min-h-[44px]"
                      placeholder="Enter student name"
                    />
                    {errors.student_name && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.student_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-1 sm:mb-2">
                      Project Title *
                    </label>
                    <input
                      {...register('project_title', { required: 'Project title is required' })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base min-h-[44px]"
                      placeholder="Enter project title"
                    />
                    {errors.project_title && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.project_title.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-1 sm:mb-2">
                    Project Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Project description is required' })}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base resize-vertical min-h-[88px]"
                    placeholder="Describe the project, its features, and what makes it special..."
                  />
                  {errors.description && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-1 sm:mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 appearance-none cursor-pointer text-sm sm:text-base min-h-[44px]"
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
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-1 sm:mb-2">
                    Tools/Technologies * (comma-separated)
                  </label>
                  <input
                    {...register('tools_technologies', { required: 'Technologies are required' })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base min-h-[44px]"
                    placeholder="React, Node.js, MongoDB, etc."
                  />
                  {errors.tools_technologies && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.tools_technologies.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-1 sm:mb-2">
                      LinkedIn Profile URL
                    </label>
                    <div className="space-y-2 sm:space-y-3">
                      <input
                        {...register('linkedin_link')}
                        onChange={(e) => watchLinkedInUrl(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base min-h-[44px]"
                        placeholder="https://linkedin.com/in/username"
                      />
                      {/* LinkedIn Profile Picture Preview */}
                      {linkedinProfilePic && (
                        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-800/30 dark:bg-gray-800/30 light:bg-gray-100 rounded-lg border border-purple-500/20 dark:border-purple-500/20 light:border-purple-200">
                          <img
                            src={linkedinProfilePic}
                            alt="LinkedIn Profile"
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-purple-500/30 object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-green-400 dark:text-green-400 light:text-green-600 font-medium">
                              ✓ Profile picture loaded
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-500 truncate">
                              This will be used in the portfolio
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {fetchingLinkedinPic && (
                        <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-purple-400 dark:text-purple-400 light:text-purple-600">
                          <div className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Fetching profile picture...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-1 sm:mb-2">
                      GitHub Link
                    </label>
                    <input
                      {...register('github_link')}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base min-h-[44px]"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-1 sm:mb-2">
                    Live Project Link
                  </label>
                  <input
                    {...register('live_project_link')}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base min-h-[44px]"
                    placeholder="https://your-project.com"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2 sm:mb-3">
                    Main Project Image * (JPG, PNG, WebP - Max 2MB)
                  </label>
                  
                  {/* Image Upload Button and Preview */}
                  <div className="space-y-2 sm:space-y-3">
                    {/* Upload Button */}
                    <div className="flex items-center space-x-3">
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-all duration-300 text-sm font-medium min-h-[44px]"
                      >
                        <Upload size={16} />
                        <span>Choose Image</span>
                      </label>
                      
                      {selectedImage && (
                        <div className="flex items-center space-x-2 text-sm text-green-400">
                          <span>✓</span>
                          <span>{selectedImage.name}</span>
                          <span className="text-gray-400">({(selectedImage.size / 1024 / 1024).toFixed(2)}MB)</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="Project preview"
                          className="w-full h-48 sm:h-56 object-cover rounded-lg border border-purple-500/30 bg-gray-100 dark:bg-gray-800"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== 'https://via.placeholder.com/600x400/6366f1/ffffff?text=Preview+Error') {
                              target.src = 'https://via.placeholder.com/600x400/6366f1/ffffff?text=Preview+Error';
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                          <button
                            type="button"
                            onClick={removeImage}
                            className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 text-sm"
                          >
                            <X size={16} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* File Input */}
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    
                    {/* Upload Instructions */}
                    {!imagePreview && (
                      <div className="text-center p-6 border-2 border-dashed border-purple-500/30 rounded-lg bg-gray-800/10">
                        <Image className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-400 mb-1">No image selected</p>
                        <p className="text-xs text-gray-500">Choose an image file to upload</p>
                      </div>
                    )}
                    
                    {/* Error Display */}
                    {imageError && (
                      <div className="p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm">{imageError}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Validation Error */}
                  {errors.main_project_image && (
                    <p className="text-red-400 text-xs sm:text-sm mt-2">{errors.main_project_image.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-1 sm:mb-2">
                    Project Video URL (optional)
                  </label>
                  <input
                    {...register('project_video')}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm sm:text-base min-h-[44px]"
                    placeholder="https://youtube.com/watch?v=... (optional)"
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4 pt-3 sm:pt-4 lg:pt-6">
                  <motion.button
                    type="submit"
                    className="flex items-center justify-center space-x-2 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 flex-1 text-xs sm:text-sm lg:text-base min-h-[44px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 border border-gray-600 dark:border-gray-600 light:border-gray-300 text-gray-400 dark:text-gray-400 light:text-gray-600 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300 text-xs sm:text-sm lg:text-base min-h-[44px]"
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
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-2 sm:border-3 lg:border-4 border-purple-500/30 border-t-purple-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-purple-200 dark:border-purple-500/20 hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                  <div className="flex space-x-2 sm:space-x-3 lg:space-x-4 flex-1">
                    <img
                      src={project.main_project_image || 'https://via.placeholder.com/100x100?text=Project'}
                      alt={`${project.project_title} project image`}
                      className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-lg border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 bg-gray-100 dark:bg-gray-800"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== 'https://via.placeholder.com/100x100?text=Project') {
                          target.src = 'https://via.placeholder.com/100x100?text=Project';
                        }
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{project.project_title}</h3>
                      <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-400 mb-1 sm:mb-2">by {project.student_name}</p>
                      <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
                        {project.tools_technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-600/20 dark:bg-purple-600/20 light:bg-purple-100 text-purple-300 dark:text-purple-300 light:text-purple-700 rounded text-xs border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 whitespace-nowrap"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 text-xs text-gray-700 dark:text-gray-400">
                        <span>❤️ {project.likes_count}</span>
                        <span>💬 {project.comments_count}</span>
                        <span className="hidden sm:inline text-xs">📅 {new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1 sm:space-x-2 justify-end sm:justify-start flex-shrink-0">
                    <motion.button
                      onClick={() => handleEdit(project)}
                      className="p-1.5 sm:p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg transition-all duration-300 flex-shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit size={12} className="sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(project.id)}
                      className="p-1.5 sm:p-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-all duration-300 flex-shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={12} className="sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
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