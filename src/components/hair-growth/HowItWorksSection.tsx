import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * How it works section component explaining the treatment process
 * Redesigned with animated progression from first step to last
 */
const HowItWorksSection: React.FC = () => {
  const stepsData = [
    {
      number: 1,
      title: "Triagem Rápida",
      description: "Preencha um questionário detalhado sobre sua saúde e histórico capilar",
      image: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/how0.webp",
    },
    {
      number: 2,
      title: "Revisão Médica",
      description: "Converse com um dermatologista especializado sobre seu caso",
      image: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/how1.webp",
    },
    {
      number: 3,
      title: "Plano Personalizado",
      description: "Receba um tratamento sob medida para suas necessidades",
      image: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/how2.webp",
    },
    {
      number: 4,
      title: "Acompanhamento",
      description: "Suporte contínuo e ajustes no tratamento quando necessário",
      image: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/how3.webp",
    }
  ];

  // Estado para controlar a animação
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCards, setShowCards] = useState<boolean[]>([false, false, false, false]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [hasStartedAnimation, setHasStartedAnimation] = useState(false);

  // Função para ativar a sequência de animação
  const startAnimation = () => {
    if (hasStartedAnimation) return;
    setHasStartedAnimation(true);
    
    // Sequência para ativar os passos
    const startSequence = () => {
      // Primeiro passo
      setActiveStep(0);
      setShowCards(prev => [true, false, false, false]);
      
      // Após 1.5s, completar o primeiro e ativar o segundo
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, 0]);
        setActiveStep(1);
        setShowCards(prev => [true, true, false, false]);
        
        // Após 1.5s, completar o segundo e ativar o terceiro
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, 1]);
          setActiveStep(2);
          setShowCards(prev => [true, true, true, false]);
          
          // Após 1.5s, completar o terceiro e ativar o quarto
          setTimeout(() => {
            setCompletedSteps(prev => [...prev, 2]);
            setActiveStep(3);
            setShowCards(prev => [true, true, true, true]);
          }, 1500);
        }, 1500);
      }, 1500);
    };
    
    startSequence();
  };

  // Observar quando a seção estiver visível para iniciar a animação
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startAnimation();
        }
      },
      { threshold: 0.3 }
    );
    
    observer.observe(sectionRef.current);
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Calcular a largura da linha de progresso com base nos passos concluídos
  const getProgressWidth = () => {
    if (completedSteps.length === 0) return '0%';
    if (completedSteps.length === 1) return '25%';
    if (completedSteps.length === 2) return '50%';
    if (completedSteps.length === 3) return '75%';
    return '100%';
  };

  // Determinar o status de cada passo
  const getStepStatus = (index: number) => {
    if (completedSteps.includes(index)) return 'completed';
    if (activeStep === index) return 'active';
    return 'pending';
  };

  // Estilos para cada status
  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          circle: "bg-[#8A3A34] text-white border-0",
          text: "text-[#8A3A34]"
        };
      case 'active':
        return {
          circle: "bg-white border-2 border-[#8A3A34] text-[#8A3A34]",
          text: "text-[#8A3A34]"
        };
      default: // pending
        return {
          circle: "bg-white border-2 border-gray-300 text-gray-400",
          text: "text-gray-500"
        };
    }
  };

  return (
    <div ref={sectionRef} className="py-16 md:py-24 bg-white w-full">
      <div className="max-w-[1280px] w-full mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Como funciona?
        </h2>
        
        {/* Desktop timeline */}
        <div ref={timelineRef} className="hidden md:block mb-16">
          <div className="relative pb-16">
            {/* Linha de fundo (cinza) */}
            <div className="absolute top-8 left-0 right-0 h-[2px] bg-gray-200 z-0"></div>
            
            {/* Linha de progresso (vermelha) */}
            <div 
              className="absolute top-8 left-0 h-[2px] bg-[#8A3A34] z-0 transition-all duration-1000 ease-in-out"
              style={{ width: getProgressWidth() }}
            ></div>
            
            {/* Círculos do timeline */}
            <div className="flex justify-between relative z-10">
              {stepsData.map((step, index) => {
                const status = getStepStatus(index);
                const styles = getStepStyles(status);
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${styles.circle}`}
                    >
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : (
                        <span className="text-xl font-bold">{step.number}</span>
                      )}
                    </div>
                    <p className={`mt-4 font-medium text-center transition-colors duration-500 ${styles.text}`}>
                      {step.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Cards para cada passo */}
          <div className="grid grid-cols-4 gap-6 mt-8">
            {stepsData.map((step, index) => {
              const status = getStepStatus(index);
              
              return (
                <div 
                  key={`card-${index}`}
                  className={`transform transition-all duration-700 ease-in-out 
                    ${showCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} 
                    ${status === 'active' ? 'border-2 border-[#8A3A34]' : ''}
                    bg-white rounded-lg p-5 shadow-md flex flex-col h-full`}
                >
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <p className={`text-gray-700 ${status === 'active' ? 'font-medium' : ''}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Mobile timeline */}
        <div className="md:hidden space-y-12">
          {stepsData.map((step, index) => {
            const status = getStepStatus(index);
            const styles = getStepStyles(status);
            
            return (
              <div 
                key={index}
                className={`relative flex items-start transition-all duration-500 ease-in-out 
                  ${showCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} 
                  ${status === 'active' ? 'bg-white p-4 rounded-lg shadow-md border border-[#8A3A34]' : ''}`}
              >
                {/* Círculo e linha */}
                <div className="mr-6 flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md z-10 transition-all duration-500 ${styles.circle}`}>
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span className="text-lg font-bold">{step.number}</span>
                    )}
                  </div>
                  
                  {/* Linha vertical */}
                  {index < stepsData.length - 1 && (
                    <div className="relative w-[2px] bg-gray-200 h-full absolute top-12 left-[22px] z-0">
                      {status === 'completed' && (
                        <div 
                          className="absolute top-0 left-0 w-full bg-[#8A3A34] transition-all duration-1000 ease-in-out"
                          style={{ height: '100%' }}
                        ></div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Conteúdo */}
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold mb-3 ${styles.text}`}>
                    {step.title}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-gray-700">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Botão de ação */}
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
