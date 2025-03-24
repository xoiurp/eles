import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

/**
 * Hero section component with infinite scroll images
 */
const HeroSection: React.FC = () => {
  return (
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
                  <img src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Shampoo%20Antiqueda%20+%20Realista%20+%20Expanded%20Center.webp" alt="Hair Product 2" className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform" />
                  <img src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Aplicando%20Minoxidil%20Eles.png" alt="Hair Product 3" className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform" />
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
                  <img src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Minoxidil%20Metade%20%20Rosto%20Ruido%205.png" alt="Hair Product 5" className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform" />
                  <img src="https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket//Minoxidil%203.png" alt="Hair Product 6" className="w-full aspect-[947/625] object-contain rounded-xl shadow-md hover:scale-[1.02] transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;