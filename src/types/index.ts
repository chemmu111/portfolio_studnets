export interface Project {
  id: string;
  student_name: string;
  project_title: string;
  description?: string;
  tools_technologies: string[];
  category?: string;
  created_at: string;
  linkedin_link?: string;
  github_link?: string;
  live_project_link?: string;
  linkedin_profile_picture?: string;
  main_project_image: string;
  project_video?: string;
  likes_count: number;
  comments_count: number;
}

export interface Comment {
  id: string;
  project_id: string;
  user_name: string;
  comment_text: string;
  created_at: string;
}

export interface Like {
  id: string;
  project_id: string;
  user_ip: string;
  created_at: string;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  setAuthState: (state: { isAuthenticated: boolean; isAdmin: boolean; email: string }) => void;
  email: string | null;
}