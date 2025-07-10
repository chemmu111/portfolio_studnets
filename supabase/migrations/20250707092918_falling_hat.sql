/*
  # Add category field to projects table

  1. Changes
    - Add `category` column to `projects` table
    - Set default value to empty string
    - Allow null values for backward compatibility

  2. Security
    - No changes to existing RLS policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'category'
  ) THEN
    ALTER TABLE projects ADD COLUMN category text;
  END IF;
END $$;