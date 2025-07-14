import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Project } from '../types';
import toast from 'react-hot-toast';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  loadProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'likes_count' | 'comments_count'>) => Promise<boolean>;
  updateProject: (id: string, project: Partial<Project>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  refreshProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure all projects have default values for missing fields
      const processedProjects = (data || []).map(project => ({
        ...project,
        main_project_image: project.main_project_image || 'https://via.placeholder.com/400x300/6366f1/ffffff?text=Project',
        linkedin_profile_picture: project.linkedin_profile_picture || 'https://via.placeholder.com/40x40/a855f7/ffffff?text=👤',
        category: project.category || 'Uncategorized',
        description: project.description || '',
        tools_technologies: project.tools_technologies || [],
        likes_count: project.likes_count || 0,
        comments_count: project.comments_count || 0,
        linkedin_link: project.linkedin_link || '',
        github_link: project.github_link || '',
        live_project_link: project.live_project_link || '',
        project_video: project.project_video || ''
      }));
      
      setProjects(processedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'likes_count' | 'comments_count'>): Promise<boolean> => {
    try {
      const newProject = {
        ...projectData,
        main_project_image: projectData.main_project_image || 'https://via.placeholder.com/400x300/6366f1/ffffff?text=Project',
        linkedin_profile_picture: projectData.linkedin_profile_picture || 'https://via.placeholder.com/40x40/a855f7/ffffff?text=👤',
        category: projectData.category || 'Uncategorized',
        description: projectData.description || '',
        tools_technologies: projectData.tools_technologies || [],
        likes_count: 0,
        comments_count: 0,
        linkedin_link: projectData.linkedin_link || '',
        github_link: projectData.github_link || '',
        live_project_link: projectData.live_project_link || '',
        project_video: projectData.project_video || ''
      };

      const { error } = await supabase
        .from('projects')
        .insert([newProject]);

      if (error) throw error;
      
      // Refresh projects list to get the new project with its ID
      await loadProjects();
      toast.success('Project created successfully!');
      return true;
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to create project');
      return false;
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id);

      if (error) throw error;
      
      // Refresh projects list to get updated data
      await loadProjects();
      toast.success('Project updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
      return false;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh projects list to remove deleted project
      await loadProjects();
      toast.success('Project deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
      return false;
    }
  };

  const refreshProjects = () => {
    loadProjects();
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const value: ProjectContextType = {
    projects,
    loading,
    loadProjects,
    addProject,
    updateProject,
    deleteProject,
    refreshProjects,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};