import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Linkedin, Calendar } from 'lucide-react';
import { Project } from '../types';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ProjectCardProps {
  project: Project;
  onUpdate?: () => void;
}

interface Comment {
  id: string;
  project_id: string;
  user_name: string;
  comment_text: string;
  created_at: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onUpdate }) => {
  // Removed like/comment state
  const [showDetails, setShowDetails] = useState(false);

  // Removed like/comment handlers

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-200 dark:border-purple-500/20 hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="relative overflow-hidden">
          <motion.img
            src={project.main_project_image}
            alt={project.project_title}
            className="w-full h-48 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-4 right-4 flex space-x-2">
            {project.github_link && (
              <motion.a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-black/50 rounded-full hover:bg-purple-600 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={16} />
              </motion.a>
            )}
            {project.live_project_link && (
              <motion.a
                href={project.live_project_link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-black/50 rounded-full hover:bg-purple-600 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} />
              </motion.a>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            {project.linkedin_profile_picture && (
              <img
                src={project.linkedin_profile_picture}
                alt={project.student_name}
                className="w-10 h-10 rounded-full border-2 border-purple-500/30"
              />
            )}
            <div>
              <h4 className="font-semibold text-white dark:text-white">{project.student_name}</h4>
              <div className="flex items-center text-gray-400 dark:text-gray-400 text-sm">
                <Calendar size={12} className="mr-1" />
                {format(new Date(project.created_at), 'MMM dd, yyyy')}
              </div>
            </div>
            {project.linkedin_link && (
              <motion.a
                href={project.linkedin_link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-blue-400 hover:text-blue-300 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin size={20} />
              </motion.a>
            )}
          </div>

          <h3 className="text-xl font-bold mb-2 text-white dark:text-white hover:text-purple-400 dark:hover:text-purple-400 transition-colors duration-300">
            {project.project_title}
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tools_technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-600/20 dark:bg-purple-600/20 text-purple-300 dark:text-purple-300 rounded-full text-xs border border-purple-500/30 dark:border-purple-500/30"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Removed like/comment section. Layout remains clean. */}

          {/* Removed comment modal section. */}
        </div>
      </motion.div>

      {/* Project Details Modal */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-200 dark:border-purple-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.project_title}</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                ✕
              </button>
            </div>
            
            <img
              src={project.main_project_image}
              alt={project.project_title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-400 dark:text-purple-400 mb-2">Student</h3>
                <p className="text-gray-900 dark:text-white">{project.student_name}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-purple-400 dark:text-purple-400 mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools_technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-600/20 dark:bg-purple-600/20 text-purple-300 dark:text-purple-300 rounded-full text-sm border border-purple-500/30 dark:border-purple-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                {project.github_link && (
                  <motion.a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                  </motion.a>
                )}
                {project.live_project_link && (
                  <motion.a
                    href={project.live_project_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 border border-purple-500 text-purple-400 dark:text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ProjectCard;