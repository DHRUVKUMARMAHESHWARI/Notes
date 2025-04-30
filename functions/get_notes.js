
// get_notes.js
// Why: GET for retrieving resources, /notes for RESTful path, reads from query string for filters
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401 
        }
      );
    }

    console.log("Fetching notes for user:", session.user.id);

    // Get query params
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '100';
    const order = url.searchParams.get('order') || 'created_at';
    const ascending = url.searchParams.get('ascending') === 'true';

    // Get notes for the current user
    let query = supabaseClient
      .from('notes')
      .select('*')
      .eq('user_id', session.user.id)
      .limit(parseInt(limit));

    // Apply ordering
    query = ascending 
      ? query.order(order, { ascending: true })
      : query.order(order, { ascending: false });
      
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching notes:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    console.log(`Successfully fetched ${data?.length || 0} notes`);
    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
