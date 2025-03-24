import React from 'react';
import { Brain, Leaf, Stethoscope, CheckCircle2 } from 'lucide-react';

/**
 * Benefits section component highlighting the advantages of the treatment
 */
const BenefitsSection: React.FC = () => {
  // Benefits data
  const benefits = [
    {
      icon: Brain,
      title: "Cientificamente Comprovado",
      description: "Tratamentos baseados em estudos clínicos e aprovados pela ANVISA"
    },
    {
      icon: Leaf,
      title: "Menos Efeitos Colaterais",
      description: "Pesquisamos constantemente tratamentos eficazes com redução de efeitos colaterais"
    },
    {
      icon: Stethoscope,
      title: "Acompanhamento Médico",
      description: "Consultas online com dermatologistas especializados"
    },
    {
      icon: CheckCircle2,
      title: "Resultados Garantidos",
      description: "Satisfação garantida ou seu dinheiro de volta em até 90 dias"
    }
  ];

  return (
    <div className="py-16 md:py-24 bg-white rounded-t-xl mt-[-20px] relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Por que escolher nosso tratamento?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-[#8A3A34]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <benefit.icon className="w-8 h-8 text-[#8A3A34]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
              <p className="text-gray-700">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;