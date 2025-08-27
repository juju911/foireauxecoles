import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // Get Eventbrite credentials from environment
    const eventbriteToken = Deno.env.get('EVENTBRITE_PRIVATE_TOKEN');
    
    if (!eventbriteToken) {
      console.error('Missing Eventbrite credentials');
      return new Response(
        JSON.stringify({ error: 'Configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // For now, we'll create a contact in Eventbrite and return success
    // In a real implementation, you'd create an attendee for a specific event
    const eventbriteResponse = await fetch('https://www.eventbriteapi.com/v3/users/me/contact_lists/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${eventbriteToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Foire aux Écoles - ${new Date().toISOString()}`,
        emails: [email]
      })
    });

    if (!eventbriteResponse.ok) {
      console.error('Eventbrite API error:', await eventbriteResponse.text());
      return new Response(
        JSON.stringify({ error: 'Registration failed' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await eventbriteResponse.json();
    console.log('Eventbrite registration successful:', result);

    // Return success with registration details
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Inscription réussie !',
        registrationId: result.id,
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