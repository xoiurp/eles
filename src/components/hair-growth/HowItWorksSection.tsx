import React from 'react';

/**
 * How it works section component explaining the treatment process
 * Updated to match new design with centered images above titles
 */
const HowItWorksSection: React.FC = () => {
  // Updated steps data with new titles and images
  const steps = [
    {
      number: 1,
      title: "Triagem Rápida",
      description: "Preencha um questionário detalhado sobre sua saúde e histórico capilar",
      image: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/howitworks1%201@1x.webp"
    },
    {
      number: 2,
      title: "Revisão Médica",
      description: "Converse com um dermatologista especializado sobre seu caso",
      image: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/howitworks2.webp"
    },
    {
      number: 3,
      title: "Plano Personalizado",
      description: "Receba um tratamento sob medida para suas necessidades",
      image: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/howitworks3.webp"
    },
    {
      number: 4,
      title: "Acompanhamento",
      description: "Suporte contínuo e ajustes no tratamento quando necessário",
      image: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/howitworks4.webp"
    }
  ];

  return (
    <div className="py-16 md:py-24 bg-white w-full">
      <div className="max-w-[1920px] w-full mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Como funciona?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-full mx-auto px-4 md:px-12">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Step card with new layout */}
              <div className="flex flex-col items-center">
                {/* Image without circular background */}
                <div className="mb-10">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="h-[240px] w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                
                {/* Step title */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                
                {/* Step description */}
                <p className="text-gray-700 max-w-xs">
                  {step.description}
                </p>
              </div>
              {/* No arrows between steps */}
            </div>
          ))}
        </div>
        
        {/* Call to action button */}
        <div className="mt-16 text-center">
          <a
            href="/hair-growth-screening"
            className="inline-block bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-black/90 transition-all duration-300 shadow-md"
          >
            Comece Agora
          </a>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;