// Define the BeforeAfterCase interface
export interface BeforeAfterCase {
  id: number;
  name: string;
  age: number;
  months: number;
  testimonial: string;
  beforeImage: string;
  afterImage: string;
}

// Array of before and after cases
export const beforeAfterCases: BeforeAfterCase[] = [
  {
    id: 1,
    name: "André",
    age: 42,
    months: 8,
    testimonial: "Tratar com a Eles me devolveu a autoestima que eu tinha perdido. Hoje não tenho mais medo de aparecer em fotos. Depois de tanto tempo escondendo a calvície com bonés, finalmente sinto que encontrei um tratamento eficaz.",
    beforeImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/A/ricardo-antes.webp",
    afterImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/A/ricardo-depois.webp"
  },
  {
    id: 2,
    name: "Ricardo",
    age: 38,
    months: 8,
    testimonial: "A combinação de finasterida com minoxidil mudou completamente minha rotina. Nos primeiros meses já notei menos queda no banho, e agora minha esposa é a primeira a perceber como o cabelo está mais preenchido. Vale cada centavo investido.",
    beforeImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/B/b-antes.webp",
    afterImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/B/b-depois.webp"
  },
  {
    id: 3,
    name: "Gustavo",
    age: 45,
    months: 6,
    testimonial: "Comecei o tratamento já sem muita esperança depois de tentar vários produtos que prometiam milagres. A finasterida tópica e o minoxidil realmente fizeram diferença onde nada mais funcionou. Minha entrada parou de aumentar e já vejo novos fios nascendo.",
    beforeImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/C/c-antes.webp",
    afterImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/C/c-depois.webp"
  },
  {
    id: 4,
    name: "Carlos",
    age: 36,
    months: 6,
    testimonial: "Aos 42 anos achei que era tarde demais para recuperar meu cabelo. Depois de 6 meses de tratamento, até meu barbeiro comentou a diferença! A região da coroa que estava quase toda exposta agora tem cobertura novamente. Sensação indescritível.",
    beforeImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/C/c-depois.webp",
    afterImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/D/d-depois.webp"
  },
  {
    id: 5,
    name: "Marcelo",
    age: 45,
    months: 6,
    testimonial: "Minha namorada foi quem insistiu para eu começar o tratamento, e confesso que estava cético. Agora ela diz que pareço 5 anos mais jovem! O que mais me impressionou foi como o couro cabeludo ficou mais saudável, sem caspa e irritação que eu tinha antes.",
    beforeImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/E/e-antes.webp",
    afterImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/E/e-depois.webp"
  },
  {
    id: 6,
    name: "Rafael",
    age: 45,
    months: 6,
    testimonial: "Sou médico e pesquisei bastante antes de iniciar o tratamento. Optei pelo kit completo e os resultados superaram minhas expectativas. Além da redução visível da calvície, percebi que meus fios ficaram mais grossos e resistentes. Recomendo para todos meus amigos.",
    beforeImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/F/f-antes.webp",
    afterImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/F/f-depois.webp"
  },
  {
    id: 7,
    name: "Lucas",
    age: 45,
    months: 6,
    testimonial: "Comecei a perder cabelo aos 25 anos e isso afetava muito minha confiança. Depois de 8 meses de tratamento, não só recuperei boa parte dos fios como também minha autoestima. Recomendo a transformação a todos!",
    beforeImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/G/g-antes.webp",
    afterImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/G/g-depois.webp"
  },
  {
    id: 8,
    name: "Eduardo",
    age: 45,
    months: 6,
    testimonial: "Minha família tem histórico forte de calvície, todos os homens são carecas. Decidi que não queria o mesmo destino e comecei o tratamento preventivo. Um ano depois, enquanto meu irmão mais velho já perdeu muito cabelo, o meu continua firme e forte.",
    beforeImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/H/h-antes.webp",
    afterImage: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/Antes%20e%20Depois/H/h-depois.webp"
  },
];