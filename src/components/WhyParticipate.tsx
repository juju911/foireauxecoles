import { GraduationCap, Search, Handshake } from 'lucide-react';

const WhyParticipate = () => {
  const reasons = [
    {
      icon: GraduationCap,
      title: 'Découvrir les meilleures écoles',
      description: 'Explorez un large éventail d\'établissements d\'excellence',
    },
    {
      icon: Search,
      title: 'Comparer les programmes',
      description: 'Analysez les cursus et trouvez celui qui vous correspond',
    },
    {
      icon: Handshake,
      title: 'Rencontrer les experts',
      description: 'Échangez directement avec les professionnels de l\'éducation',
    },
  ];

  return (
    <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-3xl p-8">
      <h3 className="text-2xl font-bold text-white text-center mb-8">
        Pourquoi participer ?
      </h3>
      
      <div className="grid md:grid-cols-3 gap-8">
        {reasons.map((reason, index) => (
          <div
            key={reason.title}
            className="text-center group hover:transform hover:scale-105 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-orange rounded-full flex items-center justify-center shadow-orange-glow group-hover:shadow-lg transition-shadow duration-300">
              <reason.icon className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              {reason.title}
            </h4>
            <p className="text-white/80 text-sm leading-relaxed">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyParticipate;