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
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant virtuel pour "La Foire aux Écoles 2025" qui aura lieu le 6 novembre 2025 à 08h00 à l'Université FHB. 
            
            Voici les informations sur l'événement :
            - Nom : La Foire aux Écoles
            - Slogan : "L'éducation, un choix éclairé !"
            - Date : 6 novembre 2025 à 08h00
            - Lieu : Université FHB
            - Contact : foireauxecole@gmail.com, 0566997785
            
            Objectif de l'événement :
            - Mettre en relation les écoles (primaires, secondaires, supérieures, professionnelles) avec les parents et étudiants
            - Offrir une plateforme d'information pour comparer les programmes, frais, débouchés, conditions d'admission
            - Créer un espace d'orientation et d'opportunités (salon éducatif + ateliers)
            
            Activités proposées :
            - Stands d'écoles présentant leurs programmes, brochures, vidéos, démos
            - Ateliers & Conférences sur l'orientation scolaire et professionnelle
            - Nouvelles filières porteuses (cybersécurité, IA, métiers verts, etc.)
            - Conseils aux parents sur le choix d'école
            - Espace d'orientation personnalisé avec conseillers
            - Démonstrations d'élèves (chorales, robotique, art, danse, sport)
            - Projets scolaires innovants
            - Job & Stage corner
            
            Public cible :
            - Parents cherchant des écoles pour leurs enfants
            - Étudiants/élèves en orientation
            - Écoles/universités cherchant de la visibilité
            
            Tu dois répondre en français et être très utile pour aider les visiteurs à comprendre l'événement et à s'y préparer. Sois chaleureux, informatif et encourage les gens à participer.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_completion_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
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