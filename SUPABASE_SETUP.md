# Supabase Setup Guide

This project has been migrated from Firebase to Supabase for authentication and database functionality.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_KEY=your_supabase_anon_key

# Optional: Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Note**: The Supabase URL is hardcoded in the configuration files as `https://kmptgukfmuhzqqiboacy.supabase.co`

## Database Schema

Your Supabase database already has the following tables configured:

### 1. Profiles Table
```sql
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text NOT NULL,
  email text,
  bio text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  plan text DEFAULT 'free'::text,
  airesponsestoday integer DEFAULT 0,
  airesponsesthisweek integer DEFAULT 0,
  lastlogin timestamp without time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
```

### 2. Questions Table
```sql
CREATE TABLE public.questions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  title text NOT NULL,
  description text,
  code_snippet text,
  tags ARRAY,
  created_at timestamp without time zone DEFAULT now(),
  language text,
  CONSTRAINT questions_pkey PRIMARY KEY (id),
  CONSTRAINT questions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
```

### 3. Answers Table
```sql
CREATE TABLE public.answers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  question_id uuid,
  user_id uuid,
  content text,
  code text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT answers_pkey PRIMARY KEY (id),
  CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id),
  CONSTRAINT answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
```

### 4. AI Requests Table
```sql
CREATE TABLE public.ai_requests (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  request_type text,
  input_text text,
  result text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT ai_requests_pkey PRIMARY KEY (id),
  CONSTRAINT ai_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
```

## Functions

### 1. Update Updated At Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to profiles and posts tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Authentication Setup

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Settings
3. Configure your site URL and redirect URLs
4. Enable email authentication
5. Optionally configure OAuth providers

## Migration from Firebase

The following changes have been made:

1. **Removed Firebase dependencies**: `firebase`, `@tanstack-query-firebase/react`
2. **Added Supabase dependencies**: `@supabase/supabase-js`, `@supabase/ssr`
3. **Updated auth provider**: Now uses Supabase authentication
4. **Updated database layer**: All database operations now use Supabase
5. **Added middleware**: For route protection and auth state management

## Testing

The existing test suite has been updated to work with Supabase. Run tests with:

```bash
npm test
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.
