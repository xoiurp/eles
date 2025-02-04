import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Sparkles, Brain, Heart, Leaf, ChevronRight, MessageSquare, Timer, Stethoscope, Truck, CreditCard, Smile, ChevronLeft, ArrowRight } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Routes, Route, Link } from 'react-router-dom';
import HairGrowth from './pages/HairGrowth';
import WeightLossScreening from './pages/WeightLossScreening';

function App() {
  const [textIndex, setTextIndex] = useState(0);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const dynamicTexts = [
    { text: 'Melhorar seu sexo', color: 'text-rose-500', gradient: 'from-rose-50' },
    { text: 'Melhorar sua pele', color: 'text-amber-500', gradient: 'from-amber-50' },
    { text: 'Perder Peso', color: 'text-green-500', gradient: 'from-green-50' },
    { text: 'Melhorar sua Mente', color: 'text-blue-500', gradient: 'from-blue-50' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((current) => (current + 1) % dynamicTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
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
      <Routes>
        <Route path="/hair-growth" element={<HairGrowth />} />
        <Route path="/" element={
          <>
      {/* Rest of the home page content */}
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

      {/* Dynamic Text Section */}
      <div className={`w-full transition-all duration-500 ease-in-out bg-gradient-to-b ${dynamicTexts[textIndex].gradient} to-white py-16 md:py-32`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Infinite Scroll Banner */}
          <div className="flex justify-center">
            <div className="w-full md:w-[80%] bg-white/80 backdrop-blur-sm rounded-full overflow-hidden shadow-lg">
              <div className="flex animate-scroll whitespace-nowrap">
                <div className="flex items-center gap-16 px-8 py-3">
                  <span className="text-rose-500 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    1.000 usuários no Brasil
                  </span>
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    A maior variedade de produtos regulados
                  </span>
                  <span className="flex items-center gap-2">
                    <Smile className="w-4 h-4 text-blue-500" />
                    Interface amigável e fácil de usar
                  </span>
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-500" />
                    Não necessita de plano de saúde
                  </span>
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-500" />
                    Frete grátis para compras acima de R$399,90
                  </span>
                  {/* Duplicate items for seamless loop */}
                  <span className="text-rose-500 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    1.000 usuários no Brasil
                  </span>
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    A maior variedade de produtos regulados
                  </span>
                  <span className="flex items-center gap-2">
                    <Smile className="w-4 h-4 text-blue-500" />
                    Interface amigável e fácil de usar
                  </span>
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-500" />
                    Não necessita de plano de saúde
                  </span>
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-500" />
                    Frete grátis para compras acima de R$399,90
                  </span>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mt-8 md:mt-12">
            Um plano para
            <br />
            <span className={`inline-block min-w-[280px] transition-all duration-500 ease-in-out ${dynamicTexts[textIndex].color}`}>
              {dynamicTexts[textIndex].text}
            </span>
            <br />
            personalizado para você
          </h1>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              <span>Tenha um ótimo Sexo</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <Link to="/hair-growth" className="hover:text-rose-500 transition-colors">Crescimento Capilar</Link>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-500" />
              <span>Perca Peso</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        {/* Second row of Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <button className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>Trate sua Ansiedade</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              <span>Melhore seu Sono</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Melhore sua Pele</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="w-full py-8">
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-4 pl-[max(1rem,calc((100vw-1280px)/2))] pr-0 cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
              setIsDragging(true);
              setStartX(e.pageX - sliderRef.current!.offsetLeft);
              setScrollLeft(sliderRef.current!.scrollLeft);
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={(e) => {
              if (!isDragging) return;
              e.preventDefault();
              const x = e.pageX - sliderRef.current!.offsetLeft;
              const walk = (x - startX) * 2;
              sliderRef.current!.scrollLeft = scrollLeft - walk;
            }}
          >
            {/* Mental Health Card */}
            <div className="relative rounded-xl overflow-hidden w-[400px] h-[500px] flex-shrink-0 snap-start">
              <img 
                src="https://cdn.prod.website-files.com/66f8804eefe222fc5aaf5cfa/66fabae104f90b04fe081af2_image%2017%401x.webp"
                alt="Mental Health"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col p-6">
                <h3 className="text-white text-3xl font-bold">Saúde Mental</h3>
                <div className="mt-auto">
                <p className="text-white/90 mb-4">Sinta o alívio e supere as aflições da mente.</p>
                <div className="flex gap-2">
                  <button className="bg-white text-black px-4 py-2 rounded-full text-sm">Conhecer</button>
                  <button className="bg-black/30 text-white px-4 py-2 rounded-full text-sm">Começar</button>
                </div>
                </div>
              </div>
            </div>

            {/* Sexual Health Card */}
            <div className="relative rounded-xl overflow-hidden w-[400px] h-[500px] flex-shrink-0 snap-start">
              <img 
                src="https://cdn.prod.website-files.com/66f8804eefe222fc5aaf5cfa/66fabaec83258143c6247373_image%2016%401x.webp"
                alt="Sexual Health"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col p-6">
                <h3 className="text-white text-3xl font-bold">Impotência Sexual</h3>
                <div className="mt-auto">
                <p className="text-white/90 mb-4">Seja sua melhor versão na hora H.</p>
                <div className="flex gap-2">
                  <button className="bg-white text-black px-4 py-2 rounded-full text-sm">Conhecer</button>
                  <button className="bg-black/30 text-white px-4 py-2 rounded-full text-sm">Começar</button>
                </div>
                </div>
              </div>
            </div>

            {/* Hair Growth Card */}
            <div className="relative rounded-xl overflow-hidden w-[400px] h-[500px] flex-shrink-0 snap-start">
              <img 
                src="https://cdn.prod.website-files.com/66f8804eefe222fc5aaf5cfa/66fabaf532627fb61889e64b_image%209%401x.webp"
                alt="Hair Growth"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col p-6">
                <h3 className="text-white text-3xl font-bold">Crescimento Capilar</h3>
                <div className="mt-auto">
                <p className="text-white/90 mb-4">Recupere os fios finos e o volume dos cabelos.</p>
                <div className="flex gap-2">
                  <button className="bg-white text-black px-4 py-2 rounded-full text-sm">Conhecer</button>
                  <button className="bg-black/30 text-white px-4 py-2 rounded-full text-sm">Começar</button>
                </div>
                </div>
              </div>
            </div>

            {/* Weight Loss Card */}
            <div className="relative rounded-xl overflow-hidden w-[400px] h-[500px] flex-shrink-0 snap-start">
              <img 
                src="https://cdn.prod.website-files.com/66f8804eefe222fc5aaf5cfa/66fabafd1a5faa533751c5e2_image%2014%401x.webp"
                alt="Weight Loss"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col p-6">
                <h3 className="text-white text-3xl font-bold">Emagrecimento</h3>
                <div className="mt-auto">
                <p className="text-white/90 mb-4">Emagreça com um plano personalizado feito para você.</p>
                <div className="flex gap-2">
                  <button className="bg-white text-black px-4 py-2 rounded-full text-sm">Conhecer</button>
                  <button className="bg-black/30 text-white px-4 py-2 rounded-full text-sm">Começar</button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Online Service */}
          <div className="bg-gray-50 p-12 rounded-xl flex flex-col items-center text-center min-h-[600px]">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Atendimento personalizado,{' '}
              <span className="text-rose-500">100% online</span>
            </h3>
            <p className="text-gray-600 mb-12 max-w-md">
              Não é necessário visita pessoal. Gerencie o tratamento no aplicativo com um login seguro.
            </p>
            <img 
              src="https://hxvvkrnxgdfledopeatb.supabase.co/storage/v1/object/public/bolt/image%2037@1x.webp"
              alt="Online Service"
              className="rounded-lg w-full h-96 object-cover mb-16"
            />
            <button className="mt-auto bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-rose-500 hover:-translate-y-1 transition-all duration-300 ease-in-out shadow-lg hover:shadow-rose-200">
              Começar
            </button>
          </div>

          {/* Ingredients */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-xl flex flex-col items-center text-center min-h-[600px]">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ingredientes{' '}
              <span className="text-rose-500">clinicamente comprovados</span>
            </h3>
            <p className="text-gray-600 mb-12 max-w-md">
              Ingredientes clinicamente testados e confiáveis por médicos.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80"
              alt="Medical Ingredients"
              className="rounded-lg w-full h-96 object-cover mb-16"
            />
            <button className="mt-auto bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-rose-500 hover:-translate-y-1 transition-all duration-300 ease-in-out shadow-lg hover:shadow-rose-200">
              Começar
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Features */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Licensed Doctors */}
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">
              Prescrito por{' '}
              <span className="text-rose-500">Médicos licenciados</span>
            </h3>
            <p className="text-gray-600 mb-8">
              Prescrições recomendadas por médicos licenciados, garantindo segurança e confiança para você.
            </p>
            <Stethoscope className="mx-auto w-16 h-16 text-rose-500 mb-6" />
            <button className="bg-black text-white px-6 py-2 rounded-full">Começar</button>
          </div>

          {/* Real-time Chat */}
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">
              Chat em{' '}
              <span className="text-rose-500">tempo real</span>
            </h3>
            <p className="text-gray-600 mb-8">
              Atendimento em tempo real para suas dúvidas, com respostas rápidas e eficientes.
            </p>
            <Timer className="mx-auto w-16 h-16 text-rose-500 mb-6" />
            <button className="bg-black text-white px-6 py-2 rounded-full">Começar</button>
          </div>
        </div>
      </div>

      {/* Popular Treatments */}
      <div className="w-full py-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 px-4 md:pl-[max(1rem,calc((100vw-1280px)/2))]">
          Tratamentos <span className="text-rose-400">populares</span>
        </h2>
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-4 px-4 md:pl-[max(1rem,calc((100vw-1280px)/2))] md:pr-0 cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
              setIsDragging(true);
              setStartX(e.pageX - sliderRef.current!.offsetLeft);
              setScrollLeft(sliderRef.current!.scrollLeft);
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={(e) => {
              if (!isDragging) return;
              e.preventDefault();
              const x = e.pageX - sliderRef.current!.offsetLeft;
              const walk = (x - startX) * 2;
              sliderRef.current!.scrollLeft = scrollLeft - walk;
            }}
          >
          {/* Weight Loss Card */}
          <div className="bg-[#C69C72] rounded-3xl p-6 md:p-8 text-white flex flex-col h-full w-[280px] md:w-[400px] flex-shrink-0">
            <div className="text-lg font-medium mb-2">Peso</div>
            <h3 className="text-2xl font-semibold mb-6 min-h-[64px] flex items-center">Injeções de GLP-1</h3>
            <div className="aspect-square mb-6 flex-shrink-0">
              <img 
                src="https://hxvvkrnxgdfledopeatb.supabase.co/storage/v1/object/public/bolt/ampola_fundo_amarelo.png"
                alt="GLP-1 Injections"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="space-y-4 mt-auto">
              <a href="#" className="text-sm underline block">Informações importantes de segurança</a>
              <div className="flex gap-3">
                <button className="bg-white text-[#C69C72] px-6 py-2 rounded-full text-sm font-medium">
                  Começar
                </button>
                <button className="bg-[#C69C72] border border-white text-white px-6 py-2 rounded-full text-sm font-medium">
                  Saber mais
                </button>
              </div>
            </div>
          </div>

          {/* Hair Treatment Card */}
          <div className="bg-[#8B4B45] rounded-3xl p-6 md:p-8 text-white flex flex-col h-full w-[280px] md:w-[400px] flex-shrink-0">
            <div className="text-lg font-medium mb-2">Cabelo</div>
            <h3 className="text-2xl font-semibold mb-6 min-h-[64px] flex items-center">Crescimento e Volume</h3>
            <div className="aspect-square mb-6 flex-shrink-0">
              <img 
                src="https://hxvvkrnxgdfledopeatb.supabase.co/storage/v1/object/public/bolt/amarela.png"
                alt="Hair Hybrid Treatment"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="space-y-4 mt-auto">
              <a href="#" className="text-sm underline block">Informações importantes de segurança</a>
              <div className="flex gap-3">
                <button className="bg-white text-[#8B4B45] px-6 py-2 rounded-full text-sm font-medium">
                  Começar
                </button>
                <button className="bg-[#8B4B45] border border-white text-white px-6 py-2 rounded-full text-sm font-medium">
                  Saber mais
                </button>
              </div>
            </div>
          </div>

          {/* Sexual Health Card */}
          <div className="bg-[#6B8EB3] rounded-3xl p-6 md:p-8 text-white flex flex-col h-full w-[280px] md:w-[400px] flex-shrink-0">
            <div className="text-lg font-medium mb-2">Sexo</div>
            <h3 className="text-2xl font-semibold mb-6 min-h-[64px] flex items-center">Tadalafila</h3>
            <div className="aspect-square mb-6 flex-shrink-0">
              <img 
                src="https://hxvvkrnxgdfledopeatb.supabase.co/storage/v1/object/public/bolt/azul.png"
                alt="Mint Treatment"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="space-y-4 mt-auto">
              <a href="#" className="text-sm underline block">Informações importantes de segurança</a>
              <div className="flex gap-3">
                <button className="bg-white text-[#6B8EB3] px-6 py-2 rounded-full text-sm font-medium">
                  Começar
                </button>
                <button className="bg-[#6B8EB3] border border-white text-white px-6 py-2 rounded-full text-sm font-medium">
                  Saber mais
                </button>
              </div>
            </div>
          </div>

          {/* Anxiety Treatment Card */}
          <div className="bg-[#0D8F6F] rounded-3xl p-6 md:p-8 text-white flex flex-col h-full w-[280px] md:w-[400px] flex-shrink-0">
            <div className="text-lg font-medium mb-2">Ansiedade</div>
            <h3 className="text-2xl font-semibold mb-6 min-h-[64px] flex items-center">Genérico para Lexapro®</h3>
            <div className="aspect-square mb-6 flex-shrink-0">
              <img 
                src="https://hxvvkrnxgdfledopeatb.supabase.co/storage/v1/object/public/bolt/verde.png"
                alt="Anxiety Treatment"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="space-y-4 mt-auto">
              <a href="#" className="text-sm underline block">Informações importantes de segurança</a>
              <div className="flex gap-3">
                <button className="bg-white text-[#0D8F6F] px-6 py-2 rounded-full text-sm font-medium">
                  Começar
                </button>
                <button className="bg-[#0D8F6F] border border-white text-white px-6 py-2 rounded-full text-sm font-medium">
                  Saber mais
                </button>
              </div>
            </div>
          </div>

          {/* Sleep Treatment Card */}
          <div className="bg-[#4B4B8B] rounded-3xl p-6 md:p-8 text-white flex flex-col h-full w-[280px] md:w-[400px] flex-shrink-0">
            <div className="text-lg font-medium mb-2">Sono</div>
            <h3 className="text-2xl font-semibold mb-6 min-h-[64px] flex items-center">Good Nights</h3>
            <div className="aspect-square mb-6 flex-shrink-0">
              <img
                src="https://hxvvkrnxgdfledopeatb.supabase.co/storage/v1/object/public/bolt/roxa.webp"
                alt="Sleep Treatment"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="space-y-4 mt-auto">
              <a href="#" className="text-sm underline block">Informações importantes de segurança</a>
              <div className="flex gap-3">
                <button className="bg-white text-[#4B4B8B] px-6 py-2 rounded-full text-sm font-medium">
                  Começar
                </button>
                <button className="bg-[#4B4B8B] border border-white text-white px-6 py-2 rounded-full text-sm font-medium">
                  Saber mais
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
          Tem perguntas?
        </h2>
        <p className="text-xl md:text-2xl text-rose-500 text-center mb-8 md:mb-16">
          Obtenha respostas
        </p>
        
        <div className="space-y-4">
          <details className="group bg-gray-50 rounded-lg [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-4 md:p-6 cursor-pointer">
              <h3 className="text-lg md:text-xl font-medium">O que é Eles?</h3>
              <span className="relative ml-1.5 h-5 w-5 flex-shrink-0">
                <ChevronRight className="absolute inset-0 h-5 w-5 transition duration-300 group-open:rotate-90" />
              </span>
            </summary>
            <div className="px-6 pb-6">
              <p className="text-gray-600">
                Eles é uma plataforma de telemedicina que conecta você a médicos licenciados e oferece tratamentos personalizados para saúde masculina. Nosso objetivo é tornar o cuidado com a saúde mais acessível e conveniente.
              </p>
            </div>
          </details>

          <details className="group bg-gray-50 rounded-lg [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer">
              <h3 className="text-xl font-medium">Como o Eles funciona?</h3>
              <span className="relative ml-1.5 h-5 w-5 flex-shrink-0">
                <ChevronRight className="absolute inset-0 h-5 w-5 transition duration-300 group-open:rotate-90" />
              </span>
            </summary>
            <div className="px-6 pb-6">
              <p className="text-gray-600">
                1. Preencha um questionário online sobre sua saúde<br />
                2. Conecte-se com um médico licenciado para uma consulta<br />
                3. Receba seu plano de tratamento personalizado<br />
                4. Seus medicamentos são entregues discretamente em sua casa
              </p>
            </div>
          </details>

          <details className="group bg-gray-50 rounded-lg [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer">
              <h3 className="text-xl font-medium">Quem são os provedores do Eles?</h3>
              <span className="relative ml-1.5 h-5 w-5 flex-shrink-0">
                <ChevronRight className="absolute inset-0 h-5 w-5 transition duration-300 group-open:rotate-90" />
              </span>
            </summary>
            <div className="px-6 pb-6">
              <p className="text-gray-600">
                Trabalhamos apenas com médicos licenciados e farmácias credenciadas no Brasil. Todos os nossos provedores são verificados e seguem rigorosos padrões de qualidade e segurança.
              </p>
            </div>
          </details>

          <details className="group bg-gray-50 rounded-lg [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer">
              <h3 className="text-xl font-medium">Eles exige seguro?</h3>
              <span className="relative ml-1.5 h-5 w-5 flex-shrink-0">
                <ChevronRight className="absolute inset-0 h-5 w-5 transition duration-300 group-open:rotate-90" />
              </span>
            </summary>
            <div className="px-6 pb-6">
              <p className="text-gray-600">
                Não, o Eles não exige seguro de saúde. Oferecemos preços transparentes e acessíveis para consultas e medicamentos, sem necessidade de plano de saúde ou mensalidades.
              </p>
            </div>
          </details>
        </div>
      </div>
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;