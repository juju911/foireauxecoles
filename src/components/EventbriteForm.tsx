import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const EventbriteForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call our Eventbrite registration edge function
      const { data, error } = await supabase.functions.invoke('eventbrite-registration', {
        body: formData
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: "Inscription réussie !",
          description: "Vous allez être redirigé vers la page de réservation de tickets.",
        });

        // Redirect to Eventbrite organizer page after successful registration
        setTimeout(() => {
          window.open(data.eventbriteUrl, '_blank');
        }, 2000);
      } else {
        throw new Error(data.error || 'Registration failed');
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-glow">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-white font-medium">
            Nom complet *
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
            placeholder="Votre nom complet"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-white font-medium">
            Adresse email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-white font-medium">
            Téléphone *
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="cta"
        size="xl"
        className="w-full animate-glow"
        disabled={isLoading}
      >
        {isLoading ? 'Inscription en cours...' : 'Je m\'inscris maintenant'}
      </Button>
    </form>
  );
};

export default EventbriteForm;