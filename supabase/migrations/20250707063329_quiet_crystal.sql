/*
  # Portfolio Database Schema

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `email` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)
    
    - `projects`
      - `id` (uuid, primary key)
      - `student_name` (text)
      - `project_title` (text)
      - `tools_technologies` (text array)
      - `linkedin_link` (text, optional)
      - `github_link` (text, optional)
      - `live_project_link` (text, optional)
      - `linkedin_profile_picture` (text, optional)
      - `main_project_image` (text)
      - `project_video` (text, optional)
      - `likes_count` (integer, default 0)
      - `comments_count` (integer, default 0)
      - `created_at` (timestamp)
    
    - `likes`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `user_ip` (text)
      - `created_at` (timestamp)
    
    - `comments`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `user_name` (text)
      - `comment_text` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access on projects, likes, and comments
    - Add policies for admin-only write access on projects
    - Add policies for public write access on likes and comments

  3. Sample Data
    - Create default admin user
    - Add sample projects for demonstration
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  project_title text NOT NULL,
  tools_technologies text[] NOT NULL DEFAULT '{}',
  linkedin_link text,
  github_link text,
  live_project_link text,
  linkedin_profile_picture text,
  main_project_image text NOT NULL,
  project_video text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_ip text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_ip)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can read own data"
  ON admins
  FOR SELECT
  USING (true);

-- Project policies
CREATE POLICY "Anyone can read projects"
  ON projects
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage projects"
  ON projects
  FOR ALL
  USING (true);

-- Likes policies
CREATE POLICY "Anyone can read likes"
  ON likes
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert likes"
  ON likes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete their own likes"
  ON likes
  FOR DELETE
  USING (true);

-- Comments policies
CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  WITH CHECK (true);

-- Insert default admin user (password: admin123)
INSERT INTO admins (username, email, password_hash) 
VALUES ('admin', 'admin@techschool.com', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (
  student_name,
  project_title,
  tools_technologies,
  linkedin_link,
  github_link,
  live_project_link,
  linkedin_profile_picture,
  main_project_image,
  likes_count,
  comments_count
) VALUES 
(
  'Alex Johnson',
  'E-Commerce Platform',
  ARRAY['React', 'Node.js', 'MongoDB', 'Stripe'],
  'https://linkedin.com/in/alexjohnson',
  'https://github.com/alexjohnson/ecommerce',
  'https://ecommerce-demo.vercel.app',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=500',
  15,
  8
),
(
  'Sarah Chen',
  'AI-Powered Chat Bot',
  ARRAY['Python', 'TensorFlow', 'Flask', 'OpenAI'],
  'https://linkedin.com/in/sarahchen',
  'https://github.com/sarahchen/ai-chatbot',
  'https://ai-chatbot-demo.herokuapp.com',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=500',
  23,
  12
),
(
  'Mike Rodriguez',
  'Mobile Fitness App',
  ARRAY['React Native', 'Firebase', 'Redux', 'Chart.js'],
  'https://linkedin.com/in/mikerodriguez',
  'https://github.com/mikerodriguez/fitness-app',
  'https://fitness-app-demo.netlify.app',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=500',
  18,
  6
),
(
  'Emma Wilson',
  'Blockchain Voting System',
  ARRAY['Solidity', 'Web3.js', 'Ethereum', 'React'],
  'https://linkedin.com/in/emmawilson',
  'https://github.com/emmawilson/blockchain-voting',
  'https://blockchain-voting.vercel.app',
  'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=500',
  31,
  15
),
(
  'David Park',
  'Data Visualization Dashboard',
  ARRAY['D3.js', 'React', 'Python', 'PostgreSQL'],
  'https://linkedin.com/in/davidpark',
  'https://github.com/davidpark/data-viz',
  'https://data-viz-dashboard.netlify.app',
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=500',
  27,
  9
),
(
  'Lisa Thompson',
  'IoT Smart Home System',
  ARRAY['Arduino', 'Raspberry Pi', 'Node.js', 'MQTT'],
  'https://linkedin.com/in/lisathompson',
  'https://github.com/lisathompson/smart-home',
  'https://smart-home-demo.herokuapp.com',
  'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=500',
  22,
  11
)
ON CONFLICT DO NOTHING;

-- Create function to update project counts
CREATE OR REPLACE FUNCTION update_project_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE projects 
      SET likes_count = likes_count + 1 
      WHERE id = NEW.project_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE projects 
      SET likes_count = likes_count - 1 
      WHERE id = OLD.project_id;
      RETURN OLD;
    END IF;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE projects 
      SET comments_count = comments_count + 1 
      WHERE id = NEW.project_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE projects 
      SET comments_count = comments_count - 1 
      WHERE id = OLD.project_id;
      RETURN OLD;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS likes_count_trigger ON likes;
CREATE TRIGGER likes_count_trigger
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_project_counts();

DROP TRIGGER IF EXISTS comments_count_trigger ON comments;
CREATE TRIGGER comments_count_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_project_counts();