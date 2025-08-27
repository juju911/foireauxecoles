import heroImage from "@/assets/foire-hero-image.jpg";
import Countdown from "@/components/Countdown";
import EventbriteForm from "@/components/EventbriteForm";
import ReassuranceIcons from "@/components/ReassuranceIcons";
import WhyParticipate from "@/components/WhyParticipate";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 gradient-hero opacity-90"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="block">La Foire aux Écoles</span>
                <span className="block gradient-orange bg-clip-text text-transparent">2025</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
                <strong>L'éducation, un choix éclairé !</strong>
              </p>
              <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                Découvrez, comparez et choisissez la meilleure école pour vos enfants et vos projets d'avenir, 
                le <strong className="text-accent">06 novembre 2025 à 08h00</strong>.
              </p>
            </div>

            {/* Countdown Section */}
            <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                Plus que...
              </h2>
              <Countdown />
            </div>

            {/* Registration Form */}
            <div className="max-w-md mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <EventbriteForm />
            </div>

            {/* Reassurance Icons */}
            <div className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <ReassuranceIcons />
            </div>

            {/* Why Participate Section */}
            <div className="animate-fade-in" style={{ animationDelay: '1.2s' }}>
              <WhyParticipate />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-8 text-center">
          <p className="text-white/60 text-sm">
            © 2025 La Foire aux Écoles - Organisé par Arna Event
          </p>
        </footer>
      </div>

      {/* Chatbot */}
      <ChatBot />
    </div>
  );
};

export default Index;
