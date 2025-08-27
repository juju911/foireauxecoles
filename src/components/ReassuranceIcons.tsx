import { Shield, Users, Download } from 'lucide-react';

const ReassuranceIcons = () => {
  const features = [
    {
      icon: Shield,
      title: 'Écoles certifiées',
      description: 'Établissements reconnus',
    },
    {
      icon: Users,
      title: 'Conseillers disponibles',
      description: 'Experts à votre écoute',
    },
    {
      icon: Download,
      title: 'Tickets immédiats',
      description: 'Téléchargement instantané',
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-8">
      {features.map((feature, index) => (
        <div
          key={feature.title}
          className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 animate-fade-in"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <feature.icon className="w-5 h-5 text-accent flex-shrink-0" />
          <div className="text-left">
            <div className="text-white font-medium text-sm">{feature.title}</div>
            <div className="text-white/70 text-xs">{feature.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReassuranceIcons;