import React from 'react';
import { ShieldCheck, Users, Sparkles, Brain, Heart, Leaf, ChevronRight, MessageSquare, Timer, Stethoscope, Truck, CreditCard, Smile, ChevronLeft, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

function HairGrowth() {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchLogo = async () => {
      const { data: { publicUrl } } = supabase
        .storage
        .from('bolt')
        .getPublicUrl('logo_eles.webp');
      
      if (publicUrl) {
        setLogoUrl(publicUrl);
      }
    };

    fetchLogo();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="h-8">
            {logoUrl ? (
              <img src={logoUrl} alt="eles" className="h-full w-auto" />
            ) : (
              <div className="text-2xl font-bold text-gray-800">[e]eles</div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-gray-600">
              <ShieldCheck className="w-5 h-5" />
            </button>
            <button className="hover:text-gray-600">
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=2070"
          alt="Confident man with healthy hair"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Redescubra a confiança com cabelos mais fortes
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Tratamento personalizado para crescimento capilar masculino
              </p>
              <button className="bg-white text-black px-8 py-3 rounded-full text-lg font-medium hover:bg-rose-500 hover:text-white transition-all duration-300">
                Comece agora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Por que escolher nosso tratamento?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Cientificamente Comprovado</h3>
              <p className="text-gray-600">
                Tratamentos baseados em estudos clínicos e aprovados pela ANVISA
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Acompanhamento Médico</h3>
              <p className="text-gray-600">
                Consultas online com dermatologistas especializados
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Resultados Garantidos</h3>
              <p className="text-gray-600">
                Satisfação garantida ou seu dinheiro de volta em até 90 dias
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Steps */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Como funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Avaliação Online</h3>
              <p className="text-gray-600 mb-4">
                Preencha um questionário detalhado sobre sua saúde e histórico capilar
              </p>
              <ArrowRight className="hidden md:block absolute -right-4 top-4 w-8 h-8 text-gray-300" />
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Consulta Médica</h3>
              <p className="text-gray-600 mb-4">
                Converse com um dermatologista especializado sobre seu caso
              </p>
              <ArrowRight className="hidden md:block absolute -right-4 top-4 w-8 h-8 text-gray-300" />
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Plano Personalizado</h3>
              <p className="text-gray-600 mb-4">
                Receba um tratamento sob medida para suas necessidades
              </p>
              <ArrowRight className="hidden md:block absolute -right-4 top-4 w-8 h-8 text-gray-300" />
            </div>
            <div>
              <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mb-6">
                4
              </div>
              <h3 className="text-xl font-semibold mb-4">Acompanhamento</h3>
              <p className="text-gray-600 mb-4">
                Suporte contínuo e ajustes no tratamento quando necessário
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Resultados Reais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1595438280062-88a7040a6f48?auto=format&fit=crop&q=80&w=1000"
                alt="Before and After 1"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-gray-600 mb-4">
                  "Após 6 meses de tratamento, minha autoestima voltou. Os resultados são incríveis!"
                </p>
                <p className="font-semibold">João, 35 anos</p>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=1000"
                alt="Before and After 2"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-gray-600 mb-4">
                  "O acompanhamento médico fez toda diferença. Recomendo a todos!"
                </p>
                <p className="font-semibold">Pedro, 42 anos</p>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=crop&q=80&w=1000"
                alt="Before and After 3"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-gray-600 mb-4">
                  "Em 3 meses já notei diferença significativa. O tratamento é prático e eficaz."
                </p>
                <p className="font-semibold">Carlos, 38 anos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Pronto para começar sua transformação?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de homens que já recuperaram a confiança com nosso tratamento
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-rose-500 transition-all duration-300">
            Comece seu tratamento agora
          </button>
        </div>
      </div>
    </div>
  );
}

export default HairGrowth;