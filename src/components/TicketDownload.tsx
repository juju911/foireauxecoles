import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Calendar, MapPin, User, Phone, Mail } from 'lucide-react';

interface TicketData {
  registrationId: string;
  name: string;
  email: string;
  phone: string;
  eventbriteUrl: string;
}

interface TicketDownloadProps {
  ticketData: TicketData;
  onBackToForm: () => void;
}

const TicketDownload = ({ ticketData, onBackToForm }: TicketDownloadProps) => {
  const downloadTicket = () => {
    // Create ticket content
    const ticketContent = `
      🎟️ TICKET - FOIRE AUX ÉCOLES 2025
      =====================================
      
      📋 INFORMATIONS PARTICIPANT
      Nom: ${ticketData.name}
      Email: ${ticketData.email}
      Téléphone: ${ticketData.phone}
      
      📅 ÉVÉNEMENT
      Date: 15 Mars 2025
      Heure: 9h00 - 17h00
      Lieu: Centre des Expositions
      
      🔖 RÉFÉRENCE
      Ticket #: ${ticketData.registrationId}
      
      ✅ INSCRIPTION CONFIRMÉE
      Présentez ce ticket à l'entrée.
      
      Pour plus d'informations: ${ticketData.eventbriteUrl}
    `;

    // Create and download file
    const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-foire-ecoles-${ticketData.registrationId.slice(0, 8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-glow">
      <div className="text-center space-y-4">
        <div className="text-4xl">🎟️</div>
        <h2 className="text-2xl font-bold text-white">Inscription Confirmée !</h2>
        <p className="text-white/80">Votre ticket pour la Foire aux Écoles 2025 est prêt</p>
      </div>

      <Card className="bg-white/20 border-white/30 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-white/60">Nom</p>
              <p className="font-medium">{ticketData.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-white/60">Email</p>
              <p className="font-medium">{ticketData.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-white/60">Téléphone</p>
              <p className="font-medium">{ticketData.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-white/60">Date</p>
              <p className="font-medium">15 Mars 2025</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-4">
          <div className="flex items-center space-x-3 text-white">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-white/60">Lieu</p>
              <p className="font-medium">Centre des Expositions - 9h00 à 17h00</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-4">
          <p className="text-sm text-white/60">Référence ticket</p>
          <p className="font-mono text-sm text-white bg-white/10 p-2 rounded">
            #{ticketData.registrationId.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </Card>

      <div className="space-y-3">
        <Button
          onClick={downloadTicket}
          variant="cta"
          size="xl"
          className="w-full animate-glow"
        >
          <Download className="w-5 h-5 mr-2" />
          Télécharger mon ticket
        </Button>
        
        <Button
          onClick={() => window.open(ticketData.eventbriteUrl, '_blank')}
          variant="outline"
          size="lg"
          className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
        >
          Voir sur Eventbrite
        </Button>
        
        <Button
          onClick={onBackToForm}
          variant="ghost"
          size="sm"
          className="w-full text-white/70 hover:text-white hover:bg-white/10"
        >
          Nouvelle inscription
        </Button>
      </div>
    </div>
  );
};

export default TicketDownload;