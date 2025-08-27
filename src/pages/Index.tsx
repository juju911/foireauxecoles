import heroImage from "@/assets/foire-hero-image.jpg";
import Countdown from "@/components/Countdown";
import EventbriteForm from "@/components/EventbriteForm";
import ReassuranceIcons from "@/components/ReassuranceIcons";
import WhyParticipate from "@/components/WhyParticipate";


<script>
  // Compte à rebours
  const countdown = document.getElementById("countdown");
  const eventDate = new Date("Nov 6, 2025 08:00:00").getTime();

  setInterval(() => {
    let now = new Date().getTime();
    let distance = eventDate - now;

    if (distance < 0) {
      countdown.innerHTML = "⏰ L'événement a commencé !";
      return;
    }

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.innerHTML = `${days}j ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);

  // Soumission du formulaire vers Eventbrite
  document.getElementById("eventForm").addEventListener("submit", async function(e){
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Remplace par ton Event ID (extrait de l’URL Eventbrite)
    const eventId = "1234567890";  
    const apiToken = "TON_API_TOKEN_ICI";  

    try {
      const response = await fetch(`https://www.eventbriteapi.com/v3/orders/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "event_id": eventId,
          "email": email,
          "first_name": name.split(" ")[0],
          "last_name": name.split(" ")[1] || "",
          "phone": phone,
          "tickets": [{ "ticket_class_id": "1", "quantity": 1 }]
        })
      });

      const data = await response.json();
      console.log(data);

      // Confirmation + lien de ticket
      document.getElementById("eventForm").style.display = "none";
      document.getElementById("confirmation").style.display = "block";
      document.getElementById("ticketLink").href = data.resource_uri || "#";

    } catch (error) {
      alert("Erreur lors de l'inscription. Réessaie.");
      console.error(error);
    }
  });
</script>


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
    </div>
  );
};

export default Index;
