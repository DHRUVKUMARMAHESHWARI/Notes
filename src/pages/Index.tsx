import React, { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NoteForm from "@/components/NoteForm";
import NoteList, { Note } from "@/components/NoteList";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { PenLine, Sparkles, Flame, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/context/AuthProvider";

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Assuming you have user context for auth

  // Function to fetch notes from the Supabase table
  const fetchNotes = async () => {
    try {
      setLoading(true);

      // Fetch notes from your 'notes' table directly
      const { data: notesData, error } = await supabase
        .from("notes") // Assuming your table name is 'notes'
        .select("*"); // Select all columns, you can specify specific columns if needed

      if (error) {
        console.error("Error fetching notes:", error);
        throw error;
      }

      if (notesData) {
        setNotes(notesData);
        console.log("Notes fetched:", notesData);
      } else {
        console.log("No notes found or empty response");
        setNotes([]);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new note in the Supabase table
  const createNote = async (title: string, content: string) => {
    try {
      console.log("Creating note:", { title, content });

      const { data: newNote, error } = await supabase
        .from("notes")
        .insert([{ title, content }])
        .select(); // 👈 this fetches the inserted row(s)

      if (error) {
        console.error("Error creating note:", error);
        throw error;
      }

      if (newNote && newNote.length > 0) {
        console.log("Note created:", newNote[0]);
        setNotes((prevNotes) => [newNote[0], ...prevNotes]); // ✅ This now works
        return newNote[0];
      }
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error(`Error creating note: ${error.message}`);
    }
  };

  // Fetch notes if the user is logged in
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <Container>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-2 rounded-lg shadow-lg">
              <PenLine className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">
              NoteScribe
            </h1>
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
          <UserMenu />
        </div>

        <p className="text-purple-700 mb-8 font-medium">
          Express yourself through vibrant notes that capture your thoughts and
          ideas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold text-violet-800">Create Note</h2>
              <Flame className="h-5 w-5 text-orange-500 ml-2" />
            </div>
            <NoteForm onSubmit={createNote} />
          </div>

          <div>
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold text-violet-800">Your Notes</h2>
              <Star className="h-5 w-5 text-amber-400 ml-2" />
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-[300px] bg-white/40 backdrop-blur-sm rounded-xl border border-purple-100">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-8 w-8 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full animate-spin mb-2"></div>
                  <p className="text-purple-600 font-medium">
                    Loading your creative space...
                  </p>
                </div>
              </div>
            ) : (
              <NoteList
                notes={notes}
                onNoteSelect={(note) => {
                  toast.info(`Viewed: ${note.title}`, {
                    description: "Full note viewing functionality coming soon",
                    position: "top-center",
                  });
                }}
              />
            )}
          </div>
        </div>

        <Separator className="my-10 bg-purple-200" />

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-violet-800 flex items-center">
            <span>Supabase Integration Demo</span>
            <div className="ml-2 px-2 py-1 bg-gradient-to-r from-emerald-400 to-cyan-400 text-xs rounded-full text-white font-medium">
              Tech Stack
            </div>
          </h2>
          <Tabs defaultValue="schema" className="w-full">
            <TabsList className="bg-purple-100">
              <TabsTrigger
                value="schema"
                className="data-[state=active]:bg-violet-500 data-[state=active]:text-white"
              >
                Schema
              </TabsTrigger>
              <TabsTrigger
                value="post"
                className="data-[state=active]:bg-violet-500 data-[state=active]:text-white"
              >
                POST /notes
              </TabsTrigger>
              <TabsTrigger
                value="get"
                className="data-[state=active]:bg-violet-500 data-[state=active]:text-white"
              >
                GET /notes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="schema" className="space-y-4">
              <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                <pre className="text-white text-sm">
                  {`-- schema.sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notes
CREATE POLICY "Users can select their own notes" 
  ON notes FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can only insert their own notes
CREATE POLICY "Users can insert their own notes" 
  ON notes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX idx_notes_user_id ON notes(user_id);`}
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="post" className="space-y-4">
              <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                <pre className="text-white text-sm">
                  {`// post_notes.js
// Why: POST for creating resources, /notes for RESTful path, reads from request body for data
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Get the session to verify user is authenticated
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Get the request body
    const { title, content } = await req.json();
    
    // Validate required fields
    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: 'Title and content are required' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Insert note
    const { data, error } = await supabaseClient
      .from('notes')
      .insert([
        { 
          user_id: session.user.id,
          title,
          content 
        }
      ])
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    return new Response(
      JSON.stringify(data),
      { headers: { 'Content-Type': 'application/json' }, status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});`}
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="get" className="space-y-4">
              <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                <pre className="text-white text-sm">
                  {`// get_notes.js
// Why: GET for retrieving resources, /notes for RESTful path, reads from query string for filters
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Get the session to verify user is authenticated
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Get query params
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '100';
    const order = url.searchParams.get('order') || 'created_at';
    const ascending = url.searchParams.get('ascending') === 'true';

    // Get notes for the current user
    let query = supabaseClient
      .from('notes')
      .select('*')
      // No need to filter by user_id as RLS will handle this
      .limit(parseInt(limit));

    // Apply ordering
    query = ascending 
      ? query.order(order, { ascending: true })
      : query.order(order, { ascending: false });
      
    const { data, error } = await query;

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    return new Response(
      JSON.stringify(data),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});`}
                </pre>
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-purple-100 shadow-sm">
            <h3 className="text-lg font-bold mb-2 text-violet-800">
              Demo Commands
            </h3>
            <div className="bg-gray-900 rounded-md p-4 overflow-x-auto mb-4">
              <pre className="text-white text-sm">
                {`# Create a note
curl -X POST "https://[your-project].supabase.co/functions/v1/notes" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $ACCESS_TOKEN" \\
  -d '{"title": "Meeting Notes", "content": "Discussed project timeline"}'

# Expected response
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "auth0|user123",
  "title": "Meeting Notes",
  "content": "Discussed project timeline",
  "created_at": "2023-04-30T14:30:00Z",
  "updated_at": "2023-04-30T14:30:00Z"
}`}
              </pre>
            </div>
            <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
              <pre className="text-white text-sm">
                {`# Get all notes
curl -X GET "https://[your-project].supabase.co/functions/v1/notes?limit=10&order=created_at&ascending=false" \\
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
]`}
              </pre>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Index;
