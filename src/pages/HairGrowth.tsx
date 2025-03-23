import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Users, Sparkles, Brain, Heart, Leaf, ChevronRight, MessageSquare, Timer, Stethoscope, Truck, CreditCard, Smile, ChevronLeft, Star, CheckCircle2, ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getProducts } from '../lib/shopify';
import { ProductDialog } from '../components/ProductDialog';

// Define product type
interface Product {
  tag: string;
  name: string;
  imageUrl: string;
  id?: string;
  title?: string;
  description?: string;
  price?: string;
  handle?: string;
  imageAlt?: string;
}

function HairGrowth(): JSX.Element {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [rightmostVisibleIndex, setRightmostVisibleIndex] = useState<number | null>(null);
  const [activeCaseSlide, setActiveCaseSlide] = useState(0);
  const [visibleCases, setVisibleCases] = useState([0, 1, 2]); // Indices of visible cases
  const casesSliderRef = useRef<HTMLDivElement>(null);
  
  // Array de casos antes e depois
  const beforeAfterCases = [
    {
      id: 1,
      name: "David",
      age: 42,
      months: 8,
      testimonial: "Isso me deixou mais confiante e estou orgulhoso de mostrar para outras pessoas, especialmente aquelas que conheço que estão perdendo cabelo.",
      beforeImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/A/ricardo-antes.webp",
      afterImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/A/ricardo-depois.webp"
    },
    {
      id: 2,
      name: "Abdul",
      age: 38,
      months: 8,
      testimonial: "Usar a finasterida e o minoxidil spray tem sido um divisor de águas. Não só tenho visto resultados tremendos na minha jornada contra a queda de cabelo, mas poder lidar com dois dos meus problemas diários de queda de cabelo em apenas alguns sprays torna a vida muito mais fácil.",
      beforeImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/A/ricardo-antes.webp",
      afterImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/A/ricardo-depois.webp"
    },
    {
      id: 3,
      name: "Michael",
      age: 45,
      months: 6,
      testimonial: "A Finasterida Tópica e a solução de Minoxidil ajudaram muito a aumentar a quantidade de cabelo que tenho na cabeça, que tem crescido bastante e é um caminho para aumentar minha confiança.",
      beforeImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/A/ricardo-antes.webp",
      afterImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/A/ricardo-depois.webp"
    },
    {
      id: 4,
      name: "Courtney",
      age: 36,
      months: 6,
      testimonial: "O Hims realmente me deu confiança de volta. Meu couro cabeludo não estava mais aparecendo tão proeminente como estava antes da aplicação e a linha completa de cabelo que eu tinha quando era mais jovem começou a voltar.",
      beforeImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/A/ricardo-antes.webp",
      afterImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/A/ricardo-depois.webp"
    }
  ];
  
  // Buscar produtos do Shopify
  useEffect(() => {
    const fetchShopifyProducts = async () => {
      try {
        setLoading(true);
        const shopifyProducts = await getProducts(10, "gid://shopify/Collection/478659117249");
        
        if (shopifyProducts && shopifyProducts.length > 0) {
          setProducts(shopifyProducts);
        } else {
          // Fallback para produtos estáticos caso a API falhe
          setProducts([
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
          ]);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos do Shopify:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShopifyProducts();
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
// Detectar mudanças de slide quando o usuário rola manualmente
useEffect(() => {
  const handleScroll = () => {
    if (!sliderRef.current) return;
    
    const slideWidth = getSlideWidth();
    const scrollPosition = sliderRef.current.scrollLeft;
    
    // Calcular o slide ativo baseado na posição de scroll
    // Usando Math.round para aproveitar o snap point mais próximo
    const newActiveSlide = Math.round(scrollPosition / slideWidth);
    
    if (newActiveSlide !== activeSlide && newActiveSlide >= 0 && newActiveSlide < products.length) {
      setActiveSlide(newActiveSlide);
    }
    
    // Atualizar também o card mais à direita visível para o efeito de gradiente
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const cardElements = sliderRef.current.querySelectorAll('.flex > div');
    
    let rightmostIndex = null;
    let maxRightPosition = -Infinity;
    
    // Encontrar o card mais à direita que ainda está parcialmente visível
    cardElements.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      
      // Verificar se o card está pelo menos parcialmente visível
      const isVisible =
        cardRect.left < sliderRect.right &&
        cardRect.right > sliderRect.left;
      
      // Se estiver visível e for o mais à direita até agora
      if (isVisible && cardRect.right > maxRightPosition) {
        maxRightPosition = cardRect.right;
        rightmostIndex = index;
      }
    });
    
    setRightmostVisibleIndex(rightmostIndex);
  };

  const sliderElement = sliderRef.current;
  if (sliderElement) {
    // Usar o evento 'scrollend' quando disponível para melhor performance com scroll-snap
    // Com fallback para o evento 'scroll' com debounce
    if ('onscrollend' in window) {
      // @ts-ignore - TypeScript pode não reconhecer scrollend ainda
      sliderElement.addEventListener('scrollend', handleScroll);
      sliderElement.addEventListener('scroll', handleScroll); // Adicionar também o evento scroll para atualização contínua
      
      return () => {
        // @ts-ignore
        sliderElement.removeEventListener('scrollend', handleScroll);
        sliderElement.removeEventListener('scroll', handleScroll);
      };
    } else {
      // Fallback com debounce para o evento scroll
      let scrollTimeout: NodeJS.Timeout;
      
      const debouncedHandleScroll = () => {
        // Executar imediatamente para atualização do gradiente
        handleScroll();
        
        // Debounce para atualização do slide ativo
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 100);
      };
      
      sliderElement.addEventListener('scroll', debouncedHandleScroll);
      
      return () => {
        clearTimeout(scrollTimeout);
        sliderElement.removeEventListener('scroll', debouncedHandleScroll);
      };
    }
  }
  }, [activeSlide, products.length]);

  // Auto-play do slider com transição mais suave
  useEffect(() => {
    // Usar um intervalo mais longo para evitar problemas de performance
    const interval = setInterval(() => {
      // Avançar para o próximo slide a cada 5 segundos
      goToNextSlide();
    }, 5000);
    
    // Pausar o auto-play quando o usuário interage com o slider
    const pauseAutoPlay = () => {
      clearInterval(interval);
    };
    
    // Adicionar event listeners para pausar o auto-play durante interação
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('mouseenter', pauseAutoPlay);
      sliderElement.addEventListener('touchstart', pauseAutoPlay, { passive: true });
      
      return () => {
        clearInterval(interval);
        sliderElement.removeEventListener('mouseenter', pauseAutoPlay);
        sliderElement.removeEventListener('touchstart', pauseAutoPlay);
      };
    }
    
    return () => clearInterval(interval);
  }, [activeSlide]); // Reiniciar o intervalo quando o slide ativo muda

  // Detectar o card mais à direita visível para aplicar o efeito de gradiente
  useEffect(() => {
    const updateRightmostVisibleCard = () => {
      if (!sliderRef.current) return;
      
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const cardElements = sliderRef.current.querySelectorAll('.flex > div');
      
      let rightmostIndex = null;
      let maxRightPosition = -Infinity;
      
      // Encontrar o card mais à direita que ainda está parcialmente visível
      cardElements.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        
        // Verificar se o card está pelo menos parcialmente visível
        const isVisible =
          cardRect.left < sliderRect.right &&
          cardRect.right > sliderRect.left;
        
        // Se estiver visível e for o mais à direita até agora
        if (isVisible && cardRect.right > maxRightPosition) {
          maxRightPosition = cardRect.right;
          rightmostIndex = index;
        }
      });
      
      setRightmostVisibleIndex(rightmostIndex);
    };
    
    // Atualizar quando o componente montar e quando houver scroll
    updateRightmostVisibleCard();
    
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('scroll', updateRightmostVisibleCard);
      window.addEventListener('resize', updateRightmostVisibleCard);
      return () => {
        sliderElement.removeEventListener('scroll', updateRightmostVisibleCard);
        window.removeEventListener('resize', updateRightmostVisibleCard);
      };
    }
  }, [products.length]); // Atualizar quando a lista de produtos mudar
  
  // Atualizar os casos visíveis quando o slide ativo muda com transição suave
  useEffect(() => {
    // Adicionar classe de transição ao container
    const sliderContainer = document.querySelector('.testimonial-slider-container');
    if (sliderContainer) {
      // Adicionar classe para iniciar a transição de fade-out
      sliderContainer.classList.add('opacity-50');
      
      // Aguardar um curto período para a transição de fade-out ocorrer
      setTimeout(() => {
        // Calcular quais casos devem estar visíveis com base no slide ativo
        const newVisibleCases = [
          activeCaseSlide,
          (activeCaseSlide + 1) % beforeAfterCases.length,
          (activeCaseSlide + 2) % beforeAfterCases.length
        ];
        setVisibleCases(newVisibleCases);
        
        // Aguardar o próximo ciclo de renderização para aplicar o fade-in
        setTimeout(() => {
          sliderContainer.classList.remove('opacity-50');
        }, 50);
      }, 300);
    } else {
      // Fallback caso o container não seja encontrado
      const newVisibleCases = [
        activeCaseSlide,
        (activeCaseSlide + 1) % beforeAfterCases.length,
        (activeCaseSlide + 2) % beforeAfterCases.length
      ];
      setVisibleCases(newVisibleCases);
    }
  }, [activeCaseSlide, beforeAfterCases.length]);
  
  // Auto-play do slider de casos
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextCaseSlide();
    }, 5000);
    
    const pauseAutoPlay = () => {
      clearInterval(interval);
    };
    
    const sliderElement = casesSliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('mouseenter', pauseAutoPlay);
      sliderElement.addEventListener('touchstart', pauseAutoPlay, { passive: true });
      
      return () => {
        clearInterval(interval);
        sliderElement.removeEventListener('mouseenter', pauseAutoPlay);
        sliderElement.removeEventListener('touchstart', pauseAutoPlay);
      };
    }
    
    return () => clearInterval(interval);
  }, [activeCaseSlide]);

  // Função para calcular a largura do slide com espaçamento
  const getSlideWidth = () => {
    if (!sliderRef.current) return 384; // Valor padrão
    
    // Obter o primeiro elemento filho (slide) para calcular sua largura real
    const slideElements = sliderRef.current.querySelectorAll('.flex > div');
    if (slideElements.length === 0) return 384;
    
    // Obter a largura real do slide incluindo margens
    const slideRect = slideElements[0].getBoundingClientRect();
    return slideRect.width + 32; // 32px é o espaçamento (space-x-8)
  };

  // Função para navegar para um slide específico com transição fluida
  const goToSlide = (index: number, smooth: boolean = true) => {
    if (!sliderRef.current) return;
    
    const slideWidth = getSlideWidth();
    const newPosition = index * slideWidth;
    
    sliderRef.current.scrollTo({
      left: newPosition,
      behavior: smooth ? 'smooth' : 'auto'
    });
    
    setActiveSlide(index);
  };

  // Função para rolar para o próximo/anterior slide com snap
  const scrollToAdjacentSlide = (direction: 'next' | 'prev') => {
    if (!sliderRef.current) return;
    
    const slideWidth = getSlideWidth();
    const currentScroll = sliderRef.current.scrollLeft;
    const totalWidth = sliderRef.current.scrollWidth;
    const containerWidth = sliderRef.current.clientWidth;
    
    // Calcular o índice atual baseado na posição de scroll
    const currentIndex = Math.round(currentScroll / slideWidth);
    
    // Calcular o novo índice
    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex + 1;
      // Loop para o início se chegou ao final
      if (newIndex * slideWidth >= totalWidth - containerWidth + (slideWidth / 2)) {
        newIndex = 0;
      }
    } else {
      newIndex = currentIndex - 1;
      // Loop para o final se chegou ao início
      if (newIndex < 0) {
        newIndex = Math.floor((totalWidth - containerWidth) / slideWidth);
      }
    }
    
    // Rolar para o novo índice
    goToSlide(newIndex);
  };

  // Funções para navegar para o próximo/anterior slide
  const goToNextSlide = () => {
    scrollToAdjacentSlide('next');
  };
const goToPrevSlide = () => {
  scrollToAdjacentSlide('prev');
};
// Funções aprimoradas para o slider de casos antes/depois com transições suaves
const goToCaseSlide = (index: number) => {
  // Evitar transição desnecessária se já estiver no slide desejado
  if (index === activeCaseSlide) return;
  
  // Adicionar classe de transição ao container
  const sliderContainer = document.querySelector('.testimonial-slider-container');
  if (sliderContainer) {
    // Iniciar transição de fade-out
    sliderContainer.classList.add('opacity-50');
    
    // Aguardar a transição de fade-out antes de mudar o slide
    setTimeout(() => {
      setActiveCaseSlide(index);
    }, 300);
  } else {
    // Fallback caso o container não seja encontrado
    setActiveCaseSlide(index);
  }
};

const goToNextCaseSlide = () => {
  const nextSlide = (activeCaseSlide + 1) % beforeAfterCases.length;
  goToCaseSlide(nextSlide);
};

const goToPrevCaseSlide = () => {
  const prevSlide = activeCaseSlide === 0 ? beforeAfterCases.length - 1 : activeCaseSlide - 1;
  goToCaseSlide(prevSlide);
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
          
          <Link to="/hair-growth-screening" className="bg-white text-black px-10 py-4 rounded-full text-lg font-semibold hover:bg-white/80 transition-all duration-300 w-fit shadow-lg hover:shadow-black/20 inline-block">
            Faça a triagem agora
          </Link>
          
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
            <Link to="/hair-growth-screening" className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#8A3A34]/90 transition-all duration-600 inline-block">
              Triagem Rápida
            </Link>
          </div>
          
          <div className="relative max-w-[calc(100%-32px)] mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader className="w-12 h-12 text-[#8A3A34] animate-spin mb-4" />
                <p className="text-gray-700">Carregando produtos...</p>
              </div>
            ) : (
              <>
                {/* Slider container */}
                <div
                  className="overflow-x-auto pb-8 w-full scroll-smooth relative mb-16"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    scrollSnapType: 'x mandatory'
                  }}
                  ref={sliderRef}
                >
                  <div className="flex space-x-8 px-2 w-full transition-all duration-500">
                    {/* Map through products to create slides */}
                    {products.map((product, index) => (
                      <div
                        key={product.id || index}
                        className={`w-96 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 relative scroll-snap-align-start ${
                          index === rightmostVisibleIndex ? 'rightmost-visible-card' : ''
                        }`}
                        style={{
                          scrollSnapAlign: 'start',
                          ...(index === rightmostVisibleIndex ? {
                            maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
                          } : {})
                        }}
                      >
                        <div className="p-6 pb-0">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{product.tag}</span>
                          <h3 className="text-xl font-semibold mt-1 mb-3">{product.name}</h3>
                        </div>
                        <div className="flex justify-center items-center pl-4 pt-4 pb-4 pr-0">
                          <img
                            src={product.imageUrl}
                            alt={product.imageAlt || product.name}
                            className="w-full aspect-[1037/932] object-contain"
                            loading="lazy"
                          />
                        </div>
                        <ProductDialog product={product} />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Navigation arrows */}
                <button
                  onClick={goToPrevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-10 hidden md:block hover:bg-white hover:shadow-xl transition-all"
                  aria-label="Slide anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={goToNextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-10 hidden md:block hover:bg-white hover:shadow-xl transition-all"
                  aria-label="Próximo slide"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
                
                {/* Pagination indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                  {products.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSlide === index
                          ? 'bg-rose-500 w-4'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
  
        {/* Benefits Section */}
        <div className="py-16 md:py-24 bg-white rounded-t-xl mt-[-20px] relative z-10">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Por que escolher nosso tratamento?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#8A3A34]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-[#8A3A34]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Cientificamente Comprovado</h3>
                <p className="text-gray-700">
                  Tratamentos baseados em estudos clínicos e aprovados pela ANVISA
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#8A3A34]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-8 h-8 text-[#8A3A34]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Menos Efeitos Colaterais</h3>
                <p className="text-gray-700">
                  Pesquisamos constantemente tratamentos eficazes com redução de efeitos colaterais
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#8A3A34]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Stethoscope className="w-8 h-8 text-[#8A3A34]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Acompanhamento Médico</h3>
                <p className="text-gray-700">
                  Consultas online com dermatologistas especializados
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#8A3A34]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-[#8A3A34]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Resultados Garantidos</h3>
                <p className="text-gray-700">
                  Satisfação garantida ou seu dinheiro de volta em até 90 dias
                </p>
              </div>
              </div>
            </div>
          </div>
          
          {/* Before/After Cases Slider Section */}
          <div className="py-20 md:py-28 bg-gray-50">
            <div className="max-w-[1280px] mx-auto px-6 md:px-8">
              <div className="mb-2">
                <span className="text-blue-800 text-sm font-medium">
                  Depoimentos em destaque
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-0 text-gray-900 max-w-xl">
                  Cabelos visivelmente mais grossos e volumosos
                </h2>
                <Link to="/hair-growth-screening" className="bg-black text-white px-6 py-3 rounded-full text-base font-medium hover:bg-black/90 transition-all duration-300 w-fit md:w-auto shadow-md whitespace-nowrap">
                  Começar agora
                </Link>
              </div>
              <div className="relative w-full">
                {/* Slider container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 testimonial-slider-container">
                  {/* First testimonial card - always visible */}
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg testimonial-card">
                  <div className="relative">
                    <div className="flex">
                      <div className="w-1/2 relative">
                        <div className="absolute top-2 left-2 bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow-sm z-10">
                          Mês 0
                        </div>
                        <img
                          src={beforeAfterCases[activeCaseSlide].beforeImage}
                          alt="Antes do tratamento"
                          className="w-full aspect-[4/3] object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="w-1/2 relative">
                        <div className="absolute top-2 left-2 bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow-sm z-10">
                          Mês {beforeAfterCases[activeCaseSlide].months}
                        </div>
                        <img
                          src={beforeAfterCases[activeCaseSlide].afterImage}
                          alt="Depois do tratamento"
                          className="w-full aspect-[4/3] object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-700 text-sm leading-relaxed mb-6">
                      "{beforeAfterCases[activeCaseSlide].testimonial}"
                    </p>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#8A3A34] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {beforeAfterCases[activeCaseSlide].name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{beforeAfterCases[activeCaseSlide].name} {beforeAfterCases[activeCaseSlide].name.charAt(0)}.</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#8A3A34]" />
                          <span>Depoimento verificado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Second testimonial card - visible on md screens and up */}
                <div className="hidden md:block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg testimonial-card">
                  <div className="relative">
                    <div className="flex">
                      <div className="w-1/2 relative">
                        <div className="absolute top-2 left-2 bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow-sm z-10">
                          Mês 0
                        </div>
                        <img
                          src={beforeAfterCases[(activeCaseSlide + 1) % beforeAfterCases.length].beforeImage}
                          alt="Antes do tratamento"
                          className="w-full aspect-[4/3] object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="w-1/2 relative">
                        <div className="absolute top-2 left-2 bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow-sm z-10">
                          Mês {beforeAfterCases[(activeCaseSlide + 1) % beforeAfterCases.length].months}
                        </div>
                        <img
                          src={beforeAfterCases[(activeCaseSlide + 1) % beforeAfterCases.length].afterImage}
                          alt="Depois do tratamento"
                          className="w-full aspect-[4/3] object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-700 text-sm leading-relaxed mb-6">
                      "{beforeAfterCases[(activeCaseSlide + 1) % beforeAfterCases.length].testimonial}"
                    </p>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#8A3A34] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {beforeAfterCases[(activeCaseSlide + 1) % beforeAfterCases.length].name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{beforeAfterCases[(activeCaseSlide + 1) % beforeAfterCases.length].name} {beforeAfterCases[(activeCaseSlide + 1) % beforeAfterCases.length].name.charAt(0)}.</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#8A3A34]" />
                          <span>Depoimento verificado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Third testimonial card - visible on lg screens and up */}
                <div className="hidden lg:block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg testimonial-card">
                  <div className="relative">
                    <div className="flex">
                      <div className="w-1/2 relative">
                        <div className="absolute top-2 left-2 bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow-sm z-10">
                          Mês 0
                        </div>
                        <img
                          src={beforeAfterCases[(activeCaseSlide + 2) % beforeAfterCases.length].beforeImage}
                          alt="Antes do tratamento"
                          className="w-full aspect-[4/3] object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="w-1/2 relative">
                        <div className="absolute top-2 left-2 bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow-sm z-10">
                          Mês {beforeAfterCases[(activeCaseSlide + 2) % beforeAfterCases.length].months}
                        </div>
                        <img
                          src={beforeAfterCases[(activeCaseSlide + 2) % beforeAfterCases.length].afterImage}
                          alt="Depois do tratamento"
                          className="w-full aspect-[4/3] object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-700 text-sm leading-relaxed mb-6">
                      "{beforeAfterCases[(activeCaseSlide + 2) % beforeAfterCases.length].testimonial}"
                    </p>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#8A3A34] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {beforeAfterCases[(activeCaseSlide + 2) % beforeAfterCases.length].name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{beforeAfterCases[(activeCaseSlide + 2) % beforeAfterCases.length].name} {beforeAfterCases[(activeCaseSlide + 2) % beforeAfterCases.length].name.charAt(0)}.</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#8A3A34]" />
                          <span>Depoimento verificado</span>
                            <span>Depoimento verificado</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={goToPrevCaseSlide}
                    className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                    aria-label="Caso anterior"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </button>
                  
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3].map((index) => (
                      <button
                        key={index}
                        onClick={() => goToCaseSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === activeCaseSlide
                            ? 'bg-[#8A3A34]'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to case ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={goToNextCaseSlide}
                    className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                    aria-label="Próximo caso"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* How it works Section */}
          <div className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Como funciona?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="relative">
                  <div className="w-12 h-12 bg-[#8A3A34] text-white rounded-full flex items-center justify-center mb-6">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Avaliação Online</h3>
                  <p className="text-gray-700 mb-4">
                    Preencha um questionário detalhado sobre sua saúde e histórico capilar
                  </p>
                  <ArrowRight className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#8A3A34]/30" />
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-[#8A3A34] text-white rounded-full flex items-center justify-center mb-6">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Consulta Médica</h3>
                  <p className="text-gray-700 mb-4">
                    Converse com um dermatologista especializado sobre seu caso
                  </p>
                  <ArrowRight className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#8A3A34]/30" />
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-[#8A3A34] text-white rounded-full flex items-center justify-center mb-6">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Plano Personalizado</h3>
                  <p className="text-gray-700 mb-4">
                    Receba um tratamento sob medida para suas necessidades
                  </p>
                  <ArrowRight className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#8A3A34]/30" />
                </div>
                <div>
                  <div className="w-12 h-12 bg-[#8A3A34] text-white rounded-full flex items-center justify-center mb-6">
                    4
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Acompanhamento</h3>
                  <p className="text-gray-700 mb-4">
                    Suporte contínuo e ajustes no tratamento quando necessário
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Pronto para começar sua transformação?
              </h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de homens que já recuperaram a confiança com nosso tratamento
              </p>
              <Link to="/hair-growth-screening" className="bg-[#8A3A34] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#8A3A34]/90 transition-all duration-300 inline-block">
                Comece seu tratamento agora
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}
export default HairGrowth;
