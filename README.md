
# Supabase Notes Service

A minimal Supabase backend for a personal "notes" service that allows users to create and retrieve their notes.

## Schema Design

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
```

### Why this schema?

- **UUID as Primary Key**: Provides a unique, globally distributed system without collisions
- **Foreign Key to auth.users**: Security by design, ensuring notes are always associated with authenticated users
- **TEXT for content**: Unlimited length for note content rather than VARCHAR with arbitrary limits
- **Timestamps**: Automatic tracking of creation and update times with timezone support for global users
- **Index on user_id**: Added for performance as most queries filter by the current user

## Setup & Deployment

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Execute the SQL in `schema.sql` in the SQL Editor in your Supabase dashboard

3. Deploy the Edge Functions:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize the project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Deploy the functions
supabase functions deploy post_notes --no-verify-jwt
supabase functions deploy get_notes --no-verify-jwt
```

4. Set required environment variables:

```bash
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
supabase secrets set SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## API Endpoints

### POST /notes

Creates a new note for the authenticated user.

```javascript
// post_notes.js
// Why: POST for creating resources, /notes for RESTful path, reads from request body for data
```

#### Demo

```bash
# Create a note
curl -X POST "https://[your-project].supabase.co/functions/v1/notes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"title": "Meeting Notes", "content": "Discussed project timeline"}'

# Expected response
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "auth0|user123",
  "title": "Meeting Notes",
  "content": "Discussed project timeline",
  "created_at": "2023-04-30T14:30:00Z",
  "updated_at": "2023-04-30T14:30:00Z"
}
```

### GET /notes

Returns all notes for the authenticated user.

```javascript
// get_notes.js
// Why: GET for retrieving resources, /notes for RESTful path, reads from query string for filters
```

#### Demo

```bash
# Get all notes
curl -X GET "https://[your-project].supabase.co/functions/v1/notes?limit=10&order=created_at&ascending=false" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected response
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "auth0|user123",
    "title": "Meeting Notes",
    "content": "Discussed project timeline",
    "created_at": "2023-04-30T14:30:00Z",
    "updated_at": "2023-04-30T14:30:00Z"
  },
  {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "user_id": "auth0|user123",
    "title": "Shopping List",
    "content": "Eggs, Milk, Bread",
    "created_at": "2023-04-29T10:15:00Z",
    "updated_at": "2023-04-29T10:15:00Z"
  }
]
```
