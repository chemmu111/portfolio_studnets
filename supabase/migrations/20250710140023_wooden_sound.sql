/*
  # Clean up dummy data and set up correct admin

  1. Changes
    - Remove all dummy projects
    - Remove all dummy likes and comments
    - Update admin credentials to admin@techschool.com / admin@123
    - Clean up any existing admin records

  2. Security
    - Maintain existing RLS policies
    - Keep all table structures intact
*/

-- Clean up all existing data
DELETE FROM comments;
DELETE FROM likes;
DELETE FROM projects;
DELETE FROM admins;

-- Insert correct admin user
INSERT INTO admins (username, email, password_hash) 
VALUES ('admin', 'admin@techschool.com', 'admin@123');