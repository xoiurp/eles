import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

/**
 * FAQ Section Component
 * Displays frequently asked questions about hair growth treatments
 */
const FAQSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <p className="text-center text-gray-600 mb-12">
            Tire suas dúvidas sobre nosso tratamento para crescimento capilar
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-semibold">
                Como funciona o tratamento para crescimento capilar?
              </AccordionTrigger>
              <AccordionContent>
                Nosso tratamento personalizado combina medicamentos tópicos e orais, além de suplementos 
                específicos para estimular os folículos capilares e fortalecer os fios. Utilizamos uma 
                abordagem multifatorial que atua nas diferentes causas da queda de cabelo.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-semibold">
                Quanto tempo leva para ver resultados?
              </AccordionTrigger>
              <AccordionContent>
                Os primeiros resultados geralmente começam a aparecer entre 3 e 6 meses após o início do 
                tratamento, com redução significativa da queda. O crescimento de novos fios pode ser 
                observado a partir de 6 meses, com resultados mais expressivos entre 9 e 12 meses de 
                tratamento contínuo.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-semibold">
                O tratamento funciona para qualquer tipo de queda capilar?
              </AccordionTrigger>
              <AccordionContent>
                Nosso tratamento é mais eficaz para queda relacionada à calvície androgenética (de padrão 
                masculino ou feminino) e eflúvio telógeno (queda temporária). Outras condições como alopecia 
                areata ou cicatricial podem ter respostas variadas. Por isso, realizamos uma avaliação 
                completa para determinar o tipo de queda e as melhores opções de tratamento para cada caso.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-semibold">
                Existem efeitos colaterais?
              </AccordionTrigger>
              <AccordionContent>
                A maioria dos pacientes tolera bem o tratamento. Alguns medicamentos podem causar efeitos 
                colaterais leves e transitórios como irritação local, ressecamento do couro cabeludo ou 
                alterações hormonais em casos específicos. Todos os possíveis efeitos são discutidos 
                durante a consulta e monitorados ao longo do tratamento.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left font-semibold">
                O tratamento precisa ser contínuo?
              </AccordionTrigger>
              <AccordionContent>
                Sim, para manter os resultados alcançados, o tratamento precisa ser contínuo. Após atingir 
                os resultados desejados, geralmente transicionamos para um regime de manutenção com dosagens 
                ou frequências ajustadas. A interrupção completa do tratamento pode levar à perda gradual 
                dos resultados conquistados.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left font-semibold">
                O plano de tratamento pode ser personalizado?
              </AccordionTrigger>
              <AccordionContent>
                Absolutamente! Cada plano de tratamento é totalmente personalizado com base na sua avaliação 
                individual, histórico médico, tipo e gravidade da queda capilar, além de outros fatores 
                relevantes. Ajustamos as recomendações regularmente com base na sua resposta ao tratamento.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
