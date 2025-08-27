import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone }: RegistrationData = await req.json();
    
    console.log('Registration attempt:', { name, email, phone });

    // Store registration in database first
    const { data: registration, error: dbError } = await supabase
      .from('registrations')
      .insert({
        name,
        email,
        phone,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save registration' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Registration saved to database:', registration);

    // For now, we'll skip the Eventbrite API call and just redirect
    // The registration is saved in the database
    
    // Update registration status to success
    await supabase
      .from('registrations')
      .update({ 
        status: 'completed',
        eventbrite_response: { redirect: true }
      })
      .eq('id', registration.id);

    // Return success with registration details
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Inscription réussie !',
        registrationId: registration.id,
        eventbriteUrl: 'https://www.eventbrite.fr/o/arna-event-115369928671'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});