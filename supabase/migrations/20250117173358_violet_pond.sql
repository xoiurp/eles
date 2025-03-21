/*
  # Initial Schema Setup

  1. New Tables
    - `users` - Stores user profile information
      - `id` (uuid, primary key) - User's unique identifier
      - `email` (text) - User's email address
      - `full_name` (text) - User's full name
      - `created_at` (timestamp) - When the user was created
      - `updated_at` (timestamp) - When the user was last updated

    - `treatments` - Stores treatment information
      - `id` (uuid, primary key) - Treatment's unique identifier
      - `name` (text) - Treatment name
      - `description` (text) - Treatment description
      - `category` (text) - Treatment category (e.g., 'weight', 'hair', 'mental')
      - `image_url` (text) - URL of the treatment image
      - `created_at` (timestamp) - When the treatment was created
      - `updated_at` (timestamp) - When the treatment was last updated

    - `user_treatments` - Links users to their treatments
      - `id` (uuid, primary key) - Record's unique identifier
      - `user_id` (uuid) - Reference to users table
      - `treatment_id` (uuid) - Reference to treatments table
      - `status` (text) - Treatment status (e.g., 'active', 'completed')
      - `started_at` (timestamp) - When the treatment was started
      - `created_at` (timestamp) - When the record was created
      - `updated_at` (timestamp) - When the record was last updated

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create treatments table
CREATE TABLE IF NOT EXISTS treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_treatments table
CREATE TABLE IF NOT EXISTS user_treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  treatment_id uuid REFERENCES treatments(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_treatments ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for treatments table
CREATE POLICY "Anyone can view treatments"
  ON treatments
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_treatments table
CREATE POLICY "Users can view their own treatments"
  ON user_treatments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own treatments"
  ON user_treatments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();