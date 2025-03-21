import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Users, Sparkles, Brain, Heart, Leaf, ChevronRight, MessageSquare, Timer, Stethoscope, Truck, CreditCard, Smile, ChevronLeft, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Define product type
interface Product {
  tag: string;
  name: string;
  imageUrl: string;
}

function HairGrowth() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Define products data
  const products: Product[] = [
    {
      tag: "Anti-DHT",
      name: "Finasterida Oral",
      imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/Finasterida%20Reference%201@1x.webp"
    },
    {
      tag: "Potente",
      name: "Dutasterida Oral",
      imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/Dutasterida%20Reference%205@1x.webp"
    },
    {
      tag: "Tópico",
      name: "Minoxidil Solução",
      imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/MInox%20png%20com%20sombra%203%201@1x.webp"
    },
    {
      tag: "Sistêmico",
      name: "Minoxidil Oral",
      imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/Minoxidil%20Oral%20Png%202@1x.webp"
    },
    {
      tag: "Natural",
      name: "Saw Palmetto",
      imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/Saw%20Palmetto%20PNG%20com%20Sombra%203.webp"
    },
    {
      tag: "Vitamina",
      name: "Biotina",
      imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/Biotina%20png%20sombra%202.webp"
    },
    {
      tag: "Limpeza",
      name: "Shampoo Antiqueda",
      imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/Shampoo%20Antiqueda%20png%20com%20sombra%202%201@1x.webp"
    }
  ];

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

  // Detectar mudanças de slide quando o usuário rola manualmente
  useEffect(() => {
    const handleScroll = () => {
      if (!sliderRef.current) return;
      
      const slideWidth = 384; // Largura do slide (w-96) + espaçamento
      const scrollPosition = sliderRef.current.scrollLeft;
      
      // Calcular o slide ativo baseado na posição de scroll
      const newActiveSlide = Math.round(scrollPosition / slideWidth);
      
      if (newActiveSlide !== activeSlide && newActiveSlide >= 0 && newActiveSlide < products.length) {
        setActiveSlide(newActiveSlide);
      }
    };

    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('scroll', handleScroll);
      
      return () => {
        sliderElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [activeSlide]);

  // Auto-play do slider com transição mais suave
  useEffect(() => {
    // Usar um intervalo mais longo para evitar problemas de performance
    const interval = setInterval(() => {
      // Avançar para o próximo slide a cada 5 segundos
      goToNextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeSlide]); // Reiniciar o intervalo quando o slide ativo muda

  // Função para navegar para um slide específico com transição fluida
  const goToSlide = (index: number, smooth: boolean = true) => {
    if (!sliderRef.current) return;
    
    const slideWidth = 384; // Largura do slide (w-96) + espaçamento (space-x-8)
    const newPosition = index * slideWidth;
    
    sliderRef.current.scrollTo({
      left: newPosition,
      behavior: smooth ? 'smooth' : 'auto'
    });
    
    setActiveSlide(index);
  };

  // Função para rolar suavemente por uma quantidade específica
  const smoothScroll = (amount: number) => {
    if (!sliderRef.current) return;
    
    const currentScroll = sliderRef.current.scrollLeft;
    const totalWidth = sliderRef.current.scrollWidth;
    const containerWidth = sliderRef.current.clientWidth;
    
    // Calcular nova posição com loop infinito
    let newPosition = currentScroll + amount;
    if (newPosition < 0) newPosition = totalWidth - containerWidth;
    if (newPosition > totalWidth - containerWidth) newPosition = 0;
    
    sliderRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };

  // Funções para navegar para o próximo/anterior slide com transição mais fluida
  const goToNextSlide = () => {
    const totalSlides = products.length; // Número total de slides baseado no array de produtos
    const slideWidth = 384; // Largura do slide (w-96) + espaçamento
    
    // Rolar suavemente para a direita
    smoothScroll(slideWidth);
    
    // Atualizar o slide ativo após um pequeno atraso para permitir a animação
    setTimeout(() => {
      const nextSlide = (activeSlide + 1) % totalSlides;
      setActiveSlide(nextSlide);
    }, 300);
  };

  const goToPrevSlide = () => {
    const totalSlides = products.length; // Número total de slides baseado no array de produtos
    const slideWidth = 384; // Largura do slide (w-96) + espaçamento
    
    // Rolar suavemente para a esquerda
    smoothScroll(-slideWidth);
    
    // Atualizar o slide ativo após um pequeno atraso para permitir a animação
    setTimeout(() => {
      const prevSlide = (activeSlide - 1 + totalSlides) % totalSlides;
      setActiveSlide(prevSlide);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white z-50">
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
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] h-screen bg-[#8A3A34] mt-0">
        {/* Left Column - Content */}
        <div className="flex flex-col justify-center px-8 lg:px-24 py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-white">
            Crescimento capilar
            <br />
            <span className="text-white">simplificado</span>
          </h1>
          
          <div className="space-y-8 mb-16">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-1" />
              <p className="text-lg font-medium text-white">Recupere seus cabelos em 3-6 meses*</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-1" />
              <p className="text-lg font-medium text-white">Ingredientes aprovados por médicos</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-1" />
              <p className="text-lg font-medium text-white">100% online, com suporte ilimitado</p>
            </div>
          </div>
          
          <button className="bg-white text-black px-10 py-4 rounded-full text-lg font-semibold hover:bg-white/80 transition-all duration-300 w-fit shadow-lg hover:shadow-black/20">
            Faça a triagem agora
          </button>
          
          <p className="text-sm text-white/80 mt-12 max-w-md leading-relaxed">
            *Baseado em estudos clínicos separados de minoxidil tópico e finasterida oral.
            Produtos com prescrição requerem consulta online com um profissional licenciado.
          </p>
        </div>

        {/* Right Column - Infinite Scroll Images */}
        <div className="relative overflow-hidden hidden lg:block bg-[#8A3A34] h-screen
          after:content-[''] after:absolute after:inset-x-0 after:top-0 after:h-24 after:bg-gradient-to-b after:from-[#8A3A34] after:via-[#8A3A34]/50 after:to-transparent after:z-10
          before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-24 before:bg-gradient-to-t before:from-[#8A3A34] before:via-[#8A3A34]/50 before:to-transparent before:z-10
          [&>div]:before:content-[''] [&>div]:before:absolute [&>div]:before:inset-y-0 [&>div]:before:left-0 [&>div]:before:w-4 [&>div]:before:bg-gradient-to-r [&>div]:before:from-[#8A3A34] [&>div]:before:to-transparent [&>div]:before:z-10
          [&>div]:after:content-[''] [&>div]:after:absolute [&>div]:after:inset-y-0 [&>div]:after:right-0 [&>div]:after:w-4 [&>div]:after:bg-gradient-to-l [&>div]:after:from-[#8A3A34] [&>div]:after:to-transparent [&>div]:after:z-10
          ">
          <div className="absolute inset-0 py-0 px-6">
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* Left Column - Scrolling Down */}
              <div className="relative overflow-hidden">
                <div className="h-[220%] animate-scroll-down transform-gpu">
                  {/* First set of images */}
                  <div className="space-y-8">
                    <img 
                      src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Minoxidil%20Metade%20%20Rosto%20Ruido%209.png"
                      alt="Hair Product 1"
                      className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform"
                    />
                    <img 
                      src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Shampoo%20Antiqueda%20+%20Realista%20+%20Expanded%20Center.webp"
                      alt="Hair Product 2"
                      className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform"
                    />
                    <img 
                      src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Aplicando%20Minoxidil%20Eles.png"
                      alt="Hair Product 3"
                      className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform"
                    />
                  </div>
                  {/* Duplicate set for seamless loop */}
                  <div className="space-y-8 mt-8">
                    <img src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Minoxidil%20Metade%20%20Rosto%20Ruido%209.png" alt="Hair Product 1" className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform" />
                    <img src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Aplicando%20Minoxidil%20Eles.png" alt="Hair Product 2" className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform" />
                    <img src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Shampoo%20Antiqueda%20+%20Realista%20+%20Expanded%20Center.webp" alt="Hair Product 3" className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform" />
                  </div>
                </div>
              </div>
              
              {/* Right Column - Scrolling Up */}
              <div className="relative overflow-hidden">
                <div className="h-[220%] animate-scroll-up transform-gpu">
                  {/* First set of images */}
                  <div className="space-y-8">
                    <img 
                      src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Minoxidil%20Oral%20Vidro%20+%20Real%202.png"
                      alt="Hair Product 4"
                      className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform"
                    />
                    <img 
                      src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Minoxidil%20Metade%20%20Rosto%20Ruido%205.png"
                      alt="Hair Product 5"
                      className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform"
                    />
                    <img 
                      src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Minoxidil%203.png"
                      alt="Hair Product 6"
                      className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform"
                    />
                  </div>
                  {/* Duplicate set for seamless loop */}
                  <div className="space-y-8 mt-8">
                    <img src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Minoxidil%20Oral%20Vidro%20+%20Real%202.png" alt="Hair Product 4" className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform" />
                    <img src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Minoxidil%20Metade%20%20Rosto%20Ruido%209.png" alt="Hair Product 5" className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform" />
                    <img src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Minoxidil%203.png" alt="Hair Product 6" className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Slider Section */}
      <div className="py-16 md:py-24 h-screen bg-[#EFE8DF] rounded-t-xl mt-[-20px] relative z-10">
        <div className="max-w-[90%] mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Tratamentos comprovados pela ciência.
          </h2>
          <p className="text-xl text-center text-gray-600 mb-6 max-w-2xl mx-auto">
            Faça uma triagem rápida e descubra qual tratamento é ideal para o seu caso.
          </p>
          <div className="flex justify-center mb-16">
            <button className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-rose-500 transition-all duration-300">
              Triagem Rápida
            </button>
          </div>
          
          <div className="relative">
            {/* Slider container */}
            <div
              className="overflow-x-auto pb-8 w-full scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              ref={sliderRef}
            >
              <div className="flex space-x-8 px-2 w-full transition-all duration-500">
                {/* Map through products to create slides */}
                {products.map((product, index) => (
                  <div
                    key={index}
                    className={`w-96 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 relative`}
                  >
                    <div className="p-6 pb-0">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{product.tag}</span>
                      <h3 className="text-xl font-semibold mt-1 mb-3">{product.name}</h3>
                    </div>
                    <div className="flex justify-center items-center pl-4 pt-4 pb-4 pr-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full aspect-[1037/932] object-contain"
                      />
                    </div>
                    <button className="absolute left-6 bottom-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all">
                      <span className="text-xl font-light">+</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation arrows */}
            <button
              onClick={goToPrevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-10 hidden md:block hover:bg-white hover:shadow-xl transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={goToNextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-10 hidden md:block hover:bg-white hover:shadow-xl transition-all"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
          
          {/* No pagination dots */}
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