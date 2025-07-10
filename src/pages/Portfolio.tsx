import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Project } from '../types';
import ProjectCard from '../components/ProjectCard';

const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState<'latest' | 'oldest' | 'date'>('latest');
  const [filterDate, setFilterDate] = useState('');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);


  const categories = ['Web Application', 'Automation'];
  const useCustomDropdowns = false; // Set to false for native <select> version

  const filterProjects = useCallback(() => {
    let filtered = [...projects];
    // Date filter
    if (sortOption === 'date' && filterDate) {
      filtered = filtered.filter(project =>
        project.created_at && project.created_at.startsWith(filterDate)
      );
    }
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tools_technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(project =>
        project.category === selectedCategory
      );
    }
    // Sorting
    if (sortOption === 'latest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortOption === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, sortOption, filterDate]);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedCategory, sortOption, filterDate, filterProjects]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="portfolio" className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-24 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
            Student Portfolio
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
            Explore innovative projects created by our talented students
          </p>
        </motion.div>

        {/* Filter Section - now below header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-200 dark:border-purple-500/20 mb-8"
        >
          <div
            className="flex flex-col md:flex-row md:items-center md:space-x-6 gap-4 w-full relative"
          >
            {/* Search Project */}
            <div className="flex items-center flex-1 min-w-[180px]">
              <Search className="absolute ml-3 text-gray-400 dark:text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search Project"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-lg border border-purple-200 dark:border-purple-500/30 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all duration-300 text-base w-full md:w-56 hover:shadow-md hover:border-purple-400"
                style={{ transition: 'box-shadow 0.3s, border-color 0.3s' }}
              />
            </div>

            {/* Category Tabs */}
            <div className="flex-1 min-w-[400px] flex items-center">
              <div className="w-full flex space-x-2 bg-gray-100 dark:bg-gray-800/50 rounded-full p-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-1/2 md:w-auto flex-1 px-4 py-2 rounded-full text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${selectedCategory === '' ? 'bg-purple-600 text-white shadow-md' : 'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-700/30'}`}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-1/2 md:w-auto flex-1 px-4 py-2 rounded-full text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${selectedCategory === category ? 'bg-purple-600 text-white shadow-md' : 'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-700/30'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Tabs */}
            <div className="flex-1 min-w-[200px] flex items-center">
              <div className="w-full flex space-x-2 bg-gray-100 dark:bg-gray-800/50 rounded-full p-1">
                <button
                  onClick={() => setSortOption('latest')}
                  className={`w-1/2 md:w-auto flex-1 px-4 py-2 rounded-full text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${sortOption === 'latest' ? 'bg-purple-600 text-white shadow-md' : 'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-700/30'}`}
                >
                  Latest
                </button>
                <button
                  onClick={() => setSortOption('oldest')}
                  className={`w-1/2 md:w-auto flex-1 px-4 py-2 rounded-full text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${sortOption === 'oldest' ? 'bg-purple-600 text-white shadow-md' : 'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-700/30'}`}
                >
                  Oldest
                </button>
              </div>
            </div>

            {/* Clear Filter Button */}
            <div className="flex-1 flex justify-end items-center min-w-[120px]">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSortOption('latest');
                }}
                className="text-purple-600 dark:text-purple-400 text-base font-medium bg-transparent border-none outline-none px-2 py-1 transition-all duration-300 relative hover:underline hover:underline-offset-4 focus:underline focus:underline-offset-4"
                style={{ minWidth: 80, transition: 'color 0.3s, text-decoration 0.3s' }}
              >
                <span className="inline-block transition-all duration-300">Clear Filter</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div
              className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Projects Found</h3>
            <p className="text-gray-700 dark:text-gray-400 mb-8">
              Try adjusting your search criteria or clear the filters.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              key={sortOption + filteredProjects.map(p => p.id).join(',')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProjectCard project={project} onUpdate={loadProjects} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Portfolio;