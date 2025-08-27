import heroImage from "@/assets/foire-hero-image.jpg";
import Countdown from "@/components/Countdown";
import EventbriteForm from "@/components/EventbriteForm";
import ReassuranceIcons from "@/components/ReassuranceIcons";
import WhyParticipate from "@/components/WhyParticipate";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background with Modern Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 gradient-hero-overlay"></div>
        {/* Floating geometric elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-orange rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-gradient-premium rounded-full opacity-15 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/10 rounded-full opacity-30 blur-2xl animate-bounce-gentle"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section with Modern Typography */}
            <div className="text-center mb-16 animate-slide-up">
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
                  <span className="block mb-4 drop-shadow-2xl">La Foire aux</span>
                  <span className="block gradient-orange bg-clip-text text-transparent animate-glow font-extrabold tracking-wide">
                    ÉCOLES
                  </span>
                  <span className="block text-3xl md:text-4xl lg:text-5xl mt-4 font-light text-white/90">2025</span>
                </h1>
              </div>
              
              <div className="glass-card rounded-3xl p-8 mb-8 max-w-4xl mx-auto hover-lift">
                <p className="text-2xl md:text-3xl font-semibold text-white mb-6 leading-relaxed">
                  <span className="gradient-premium bg-clip-text text-transparent">L'éducation, un choix éclairé !</span>
                </p>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                  Découvrez, comparez et choisissez la meilleure école pour vos enfants et vos projets d'avenir
                </p>
              </div>
              
              <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto animate-pulse-soft shadow-premium">
                <p className="text-xl md:text-2xl font-bold text-white">
                  📅 <span className="gradient-orange bg-clip-text text-transparent">06 novembre 2025 à 08h00</span>
                </p>
                <p className="text-white/80 mt-2">📍 Université FHB</p>
              </div>
            </div>

            {/* Countdown Section with Modern Design */}
            <div className="text-center mb-16 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto hover-glow">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 gradient-premium bg-clip-text text-transparent">
                  ⏰ Plus que...
                </h2>
                <div className="relative">
                  <Countdown />
                  <div className="absolute inset-0 -z-10 blur-xl opacity-50">
                    <Countdown />
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form with Enhanced Design */}
            <div className="max-w-lg mx-auto mb-16 animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <div className="glass-card rounded-3xl p-8 shadow-floating hover-lift">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2 gradient-orange bg-clip-text text-transparent">
                    🎯 Réservez votre place
                  </h3>
                  <p className="text-white/80">Inscription gratuite et rapide</p>
                </div>
                <EventbriteForm />
              </div>
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

        {/* Modern Footer */}
        <footer className="relative z-10 py-12 text-center">
          <div className="glass-card rounded-2xl p-6 max-w-md mx-auto mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-8 h-8 gradient-orange rounded-full"></div>
              <span className="text-white font-semibold text-lg">La Foire aux Écoles</span>
            </div>
            <p className="text-white/80 text-sm mb-2">
              📧 foireauxecole@gmail.com
            </p>
            <p className="text-white/80 text-sm">
              📞 0566997785
            </p>
          </div>
          <p className="text-white/60 text-sm">
            © 2025 Organisé par Arna Event
          </p>
        </footer>
      </div>

      {/* Chatbot */}
      <ChatBot />
    </div>
  );
};

export default Index;
