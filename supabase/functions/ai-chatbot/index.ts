import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { message } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Processing message:', message);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant virtuel concis et amical pour "La Foire aux Écoles 2025".

INFORMATIONS ESSENTIELLES :
- Date : 6 novembre 2025 à 08h00
- Lieu : Université FHB  
- Contact : info@kehogroupe.com, 07 78 83 26 60
- Slogan : "L'éducation, un choix éclairé !"

ACTIVITÉS PRINCIPALES :
- Stands d'écoles (primaires, secondaires, supérieures, professionnelles)
- Ateliers d'orientation scolaire et professionnelle
- Conférences sur les nouvelles filières (cybersécurité, IA, métiers verts)
- Conseils personnalisés pour parents et étudiants
- Démonstrations d'élèves (robotique, art, sport)
- Espace job & stage

RÈGLES DE RÉPONSE :
- Réponses COURTES (maximum 3-4 phrases)
- Ton amical et professionnel
- Informations précises et utiles
- Encourage la participation à l'événement
- Si tu ne connais pas une info spécifique, oriente vers le contact officiel

Réponds en français de manière concise et utile.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received:', data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Structure de réponse OpenAI invalide:', data);
      throw new Error('Réponse OpenAI invalide');
    }
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Une erreur est survenue' 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});