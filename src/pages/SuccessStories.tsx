import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, MapPin, Calendar, Trophy, Briefcase, Award, Star, Building } from 'lucide-react';
import { SuccessStory } from '../types';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

const SuccessStories: React.FC = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const achievementTypes = [
    { key: 'all', label: 'All Stories', icon: Star },
    { key: 'job_placement', label: 'Job Placements', icon: Briefcase },
    { key: 'certification', label: 'Certifications', icon: Award },
    { key: 'promotion', label: 'Promotions', icon: Trophy },
    { key: 'startup', label: 'Startups', icon: Building },
    { key: 'other', label: 'Other', icon: Star },
  ];

  useEffect(() => {
    loadSuccessStories();
  }, []);

  const loadSuccessStories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const processedStories = (data || []).map(story => ({
        ...story,
        student_image: story.student_image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(story.student_name) + '&background=6366f1&color=ffffff&size=200&rounded=true',
        company: story.company || '',
        position: story.position || '',
        linkedin_link: story.linkedin_link || ''
      }));
      
      setStories(processedStories);
    } catch (error) {
      console.error('Error loading success stories:', error);
      // Mock data for demo
      setStories([
        {
          id: '1',
          student_name: 'Suhail Muhammad',
          title: 'From Student to Software Engineer at TechCorp',
          content: 'After completing the SEO class at HarisCo Academy, I was able to land my first remote job within 3 months. The comprehensive curriculum and hands-on projects gave me the confidence to excel in my interviews.',
          student_image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
          linkedin_link: 'https://linkedin.com/in/suhailmuhammad',
          company: 'TechCorp',
          position: 'Software Engineer',
          achievement_type: 'job_placement',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          student_name: 'Fathima Safhan',
          title: 'AWS Certification Success Story',
          content: 'Thanks to the excellent training at HarisCo Academy, I successfully obtained my AWS Solutions Architect certification. The practical approach and expert guidance made all the difference.',
          student_image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
          linkedin_link: 'https://linkedin.com/in/fathimasafhan',
          company: 'CloudTech Solutions',
          position: 'Cloud Architect',
          achievement_type: 'certification',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStories = selectedFilter === 'all' 
    ? stories 
    : stories.filter(story => story.achievement_type === selectedFilter);

  const getAchievementIcon = (type: string) => {
    const achievement = achievementTypes.find(a => a.key === type);
    return achievement ? achievement.icon : Star;
  };

  const getAchievementColor = (type: string) => {
    const colors = {
      job_placement: 'text-green-500 bg-green-100 dark:bg-green-900/30',
      certification: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
      promotion: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
      startup: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
      other: 'text-gray-500 bg-gray-100 dark:bg-gray-900/30'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-20 sm:pt-24 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
            Wall of Fame
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto px-4">
            Creating stories about the future
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12"
        >
          {achievementTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.key}
                onClick={() => setSelectedFilter(type.key)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base font-medium ${
                  selectedFilter === type.key
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                }`}
              >
                <IconComponent size={16} />
                <span className="hidden sm:inline">{type.label}</span>
                <span className="sm:hidden">{type.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Success Stories Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div
              className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : filteredStories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Success Stories Found</h3>
            <p className="text-gray-700 dark:text-gray-400 mb-8">
              Check back soon for inspiring success stories from our students.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredStories.map((story, index) => {
                const AchievementIcon = getAchievementIcon(story.achievement_type);
                return (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-200 dark:border-purple-500/20 hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 hover:-translate-y-2"
                  >
                    {/* Header with Profile */}
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={story.student_image}
                        alt={story.student_name}
                        className="w-12 h-12 rounded-full border-2 border-purple-500/30 object-cover bg-gray-100 dark:bg-gray-800"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== `https://ui-avatars.com/api/?name=${encodeURIComponent(story.student_name)}&background=6366f1&color=ffffff&size=200&rounded=true`) {
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.student_name)}&background=6366f1&color=ffffff&size=200&rounded=true`;
                          }
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {story.student_name}
                          </h3>
                          {story.linkedin_link && (
                            <a
                              href={story.linkedin_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
                            >
                              <Linkedin size={16} />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <Calendar size={10} className="mr-1" />
                          {format(new Date(story.created_at), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>

                    {/* Achievement Badge */}
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium mb-3 ${getAchievementColor(story.achievement_type)}`}>
                      <AchievementIcon size={12} />
                      <span className="capitalize">{story.achievement_type.replace('_', ' ')}</span>
                    </div>

                    {/* Company & Position */}
                    {(story.company || story.position) && (
                      <div className="flex items-center space-x-2 text-sm text-purple-600 dark:text-purple-400 mb-3">
                        <Building size={14} />
                        <span>
                          {story.position && story.company 
                            ? `${story.position} at ${story.company}`
                            : story.position || story.company
                          }
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {story.title}
                    </h4>

                    {/* Content */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">
                      {story.content}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default SuccessStories;