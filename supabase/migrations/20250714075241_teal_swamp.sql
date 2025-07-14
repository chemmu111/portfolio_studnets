/*
  # Add description column to projects table

  1. Changes
    - Add `description` column to `projects` table
    - Column type: text (allows for longer descriptions)
    - Column is nullable (optional field)

  2. Notes
    - This resolves the "Could not find the 'description' column" error
    - Existing projects will have NULL description values initially
    - New projects can include description data
*/

-- Add description column to projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'description'
  ) THEN
    ALTER TABLE projects ADD COLUMN description text;
  END IF;
END $$;