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

      {/* New Hero Section with Infinite Scroll */}
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] min-h-[calc(100vh-80px)] bg-[#F8F5F2]">
        {/* Left Column - Content */}
        <div className="flex flex-col justify-center px-8 lg:px-24 py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-gray-900">
            Crescimento capilar
            <br />
            <span className="text-rose-500">simplificado</span>
          </h1>
          
          <div className="space-y-8 mb-16">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
              <p className="text-lg font-medium text-gray-700">Recupere seus cabelos em 3-6 meses*</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
              <p className="text-lg font-medium text-gray-700">Ingredientes aprovados por médicos</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
              <p className="text-lg font-medium text-gray-700">100% online, com suporte ilimitado</p>
            </div>
          </div>
          
          <button className="bg-black text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-rose-500 transition-all duration-300 w-fit shadow-lg hover:shadow-rose-200">
            Faça o teste gratuito
          </button>
          
          <p className="text-sm text-gray-500 mt-12 max-w-md leading-relaxed">
            *Baseado em estudos clínicos separados de minoxidil tópico e finasterida oral.
            Produtos com prescrição requerem consulta online com um profissional licenciado.
          </p>
        </div>

        {/* Right Column - Infinite Scroll Images */}
        <div className="relative overflow-hidden hidden lg:block bg-white h-[calc(100vh-80px)] 
          after:content-[''] after:absolute after:inset-x-0 after:top-0 after:h-60 after:bg-gradient-to-b after:from-white after:via-white/95 after:to-transparent after:z-10 
          before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-60 before:bg-gradient-to-t before:from-white before:via-white/95 before:to-transparent before:z-10
          [&>div]:before:content-[''] [&>div]:before:absolute [&>div]:before:inset-y-0 [&>div]:before:left-0 [&>div]:before:w-8 [&>div]:before:bg-gradient-to-r [&>div]:before:from-white [&>div]:before:to-transparent [&>div]:before:z-10
          [&>div]:after:content-[''] [&>div]:after:absolute [&>div]:after:inset-y-0 [&>div]:after:right-0 [&>div]:after:w-8 [&>div]:after:bg-gradient-to-l [&>div]:after:from-white [&>div]:after:to-transparent [&>div]:after:z-10
          ">
          <div className="absolute inset-0 py-24 px-6">
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* Left Column - Scrolling Down */}
              <div className="relative overflow-hidden">
                <div className="h-[200%] animate-scroll-down transform-gpu">
                  {/* First set of images */}
                  <div className="space-y-4">
                    <img 
                      src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/homem-calvicie.webp"
                      alt="Hair Product 1"
                      className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
                    />
                    <img 
                      src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/homem-calvicie-lavando-com-shampoo%201@1x.webp"
                      alt="Hair Product 2"
                      className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
                    />
                    <img 
                      src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/aplicando-minox.webp"
                      alt="Hair Product 3"
                      className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
                    />
                  </div>
                  {/* Duplicate set for seamless loop */}
                  <div className="space-y-4">
                    <img src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/aplicando-minox.webp" alt="Hair Product 1" className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform" />
                    <img src="https://hxvvkrnxgdfledopeatb.supabase.co/storage/v1/object/public/bolt/hair2.webp" alt="Hair Product 2" className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform" />
                    <img src="https://hxvvkrnxgdfledopeatb.supabase.co/storage/v1/object/public/bolt/hair3.webp" alt="Hair Product 3" className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform" />
                  </div>
                </div>
              </div>
              
              {/* Right Column - Scrolling Up */}
              <div className="relative overflow-hidden">
                <div className="h-[200%] animate-scroll-up transform-gpu">
                  {/* First set of images */}
                  <div className="space-y-4">
                    <img 
                      src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/aplicando-minox.webp"
                      alt="Hair Product 4"
                      className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
                    />
                    <img 
                      src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/aplicando-minox.webp"
                      alt="Hair Product 5"
                      className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
                    />
                    <img 
                      src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/aplicando-minox.webp"
                      alt="Hair Product 6"
                      className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
                    />
                  </div>
                  {/* Duplicate set for seamless loop */}
                  <div className="space-y-4">
                    <img src="https://hxvvkrnxgdfledopeatb.supabase.co/storage/v1/object/public/bolt/hair4.webp" alt="Hair Product 4" className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform" />
                    <img src="https://hxvvkrnxgdfledopeatb.supabase.co/storage/v1/object/public/bolt/hair5.webp" alt="Hair Product 5" className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform" />
                    <img src="https://hxvvkrnxgdfledopeatb.supabase.co/storage/v1/object/public/bolt/hair6.webp" alt="Hair Product 6" className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform" />
                  </div>
                </div>
              </div>
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
              <ArrowRight className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 text-gray-300" />
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Consulta Médica</h3>
              <p className="text-gray-600 mb-4">
                Converse com um dermatologista especializado sobre seu caso
              </p>
              <ArrowRight className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 text-gray-300" />
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Plano Personalizado</h3>
              <p className="text-gray-600 mb-4">
                Receba um tratamento sob medida para suas necessidades
              </p>
              <ArrowRight className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 text-gray-300" />
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
                src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//tratamento-c1.png"
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