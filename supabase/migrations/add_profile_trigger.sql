-- Enable RLS if not already
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Change timestamp columns to timestamptz for proper ISO formatting
ALTER TABLE public.profiles ALTER COLUMN created_at TYPE timestamptz;
ALTER TABLE public.profiles ALTER COLUMN lastlogin TYPE timestamptz;

-- Create function to handle new user (security definer uses service role)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Bypass RLS for this insert
  SET LOCAL row_security = off;
  INSERT INTO public.profiles (id, username, email, plan, airesponsestoday, airesponsesthisweek, lastlogin)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'new_user'), NEW.email, 'free', 0, 0, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Policy for authenticated users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy for authenticated users to view own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy for users to insert their own profile (if manual insert needed)
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
