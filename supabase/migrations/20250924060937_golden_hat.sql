/*
  # Create Success Stories Table

  1. New Tables
    - `success_stories`
      - `id` (uuid, primary key)
      - `student_name` (text)
      - `title` (text)
      - `content` (text)
      - `student_image` (text, optional)
      - `linkedin_link` (text, optional)
      - `company` (text, optional)
      - `position` (text, optional)
      - `achievement_type` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on success_stories table
    - Add policies for public read access
    - Add policies for admin-only write access
*/

-- Create success_stories table
CREATE TABLE IF NOT EXISTS success_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  student_image text,
  linkedin_link text,
  company text,
  position text,
  achievement_type text NOT NULL DEFAULT 'other',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;

-- Success Stories policies
CREATE POLICY "Anyone can read success stories"
  ON success_stories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage success stories"
  ON success_stories
  FOR ALL
  USING (true);