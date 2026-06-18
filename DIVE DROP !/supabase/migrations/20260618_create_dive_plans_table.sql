-- Create dive_plans table
CREATE TABLE IF NOT EXISTS dive_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dive_site_id UUID REFERENCES dive_sites(id),
  instructor_id UUID REFERENCES users(id),
  experience_level TEXT NOT NULL,
  goal TEXT NOT NULL,
  ai_message TEXT,
  tips TEXT[],
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX dive_plans_user_id_idx ON dive_plans(user_id);

-- Enable RLS
ALTER TABLE dive_plans ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can manage their own plans
CREATE POLICY "Users can manage own plans"
  ON dive_plans FOR ALL
  USING (auth.uid() = user_id);
