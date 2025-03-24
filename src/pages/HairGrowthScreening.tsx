import React, { useState, useEffect, useRef } from 'react';
import { HAIR_GROWTH_SYSTEM_PROMPT } from '../constants/hair-growth-prompts';

interface DadosBasicos {
  idade: number;
  status_capilar: string;
}

interface DadosPessoais {
  nome: string;
  sobrenome: string;
  endereco: string;
}

interface DetalheCalvicie {
  tempo_inicio: string;
  padrao_queda: string;
  historico_familiar: string;
  tratamentos_anteriores: string;
}

interface Tratamento {
  nome: string;
  preco: number;
  descricao: string;
  contraindicacoes_especificas?: string[];
}

interface Summary {
  dados_basicos: DadosBasicos;
  dados_pessoais?: DadosPessoais;
  contraindicacoes: string[];
  condicoes_relevantes: string[];
  detalhes_calvicie: DetalheCalvicie;
  elegivel_tratamento: boolean;
  tratamentos_recomendados?: Tratamento[];
}
interface ImageOption {
  text: string;
  imageUrl: string;
}

interface Question {
  pergunta: string;
  opcoes?: string[] | ImageOption[];
  "did-you-know"?: boolean;
  "last_step"?: string;
  "input-text"?: boolean;
  "is_red_flag"?: boolean;
  "red_flag_value"?: string;
  "red_flags_detected"?: boolean;
  "summary"?: Summary;
  "show_treatment_button"?: boolean;
  "is_treatment_selection"?: boolean;
  "image_selection"?: boolean;
  "error_recovery"?: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Answer {
  question: string;
  answer: string;
  isRedFlag?: boolean;
}

// Determina o endpoint baseado no ambiente
const API_ENDPOINT = import.meta.env.PROD 
  ? 'https://eles-saude-masc.netlify.app/.netlify/functions/claude-proxy'
  : '/.netlify/functions/claude-proxy';

const fallbackChain: Question[] = [
  {
    pergunta: "Qual é a sua idade?",
    "input-text": true,
    "is_red_flag": true,
    "red_flag_value": "< 18"
  },
  {
    pergunta: "Selecione o padrão de calvície que mais se assemelha ao seu caso:",
    "image_selection": true,
    opcoes: [
      {
        text: "Entradas na região frontal",
        imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/visualelectric-1742594385472%201@1x.webp"
      },
      {
        text: "Afinamento no topo da cabeça",
        imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/coroa%201@1x.webp"
      },
      {
        text: "Entradas e coroa",
        imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Calvicie/ambos%201@1x.webp"
      }
    ]
  },
  {
    pergunta: "Você tem histórico de câncer de próstata?",
    opcoes: ["Sim", "Não"],
    "is_red_flag": true,
    "red_flag_value": "Sim"
  },
  {
    pergunta: "Você tem histórico de reações alérgicas a medicamentos para queda de cabelo?",
    opcoes: ["Sim", "Não"],
    "is_red_flag": true,
    "red_flag_value": "Sim"
  }
];

function HairGrowthScreening() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(fallbackChain[0]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set([fallbackChain[0].pergunta]));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [textInput, setTextInput] = useState<string>('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [hasRedFlags, setHasRedFlags] = useState<boolean>(false);
  const [dadosBasicos, setDadosBasicos] = useState<Partial<DadosBasicos>>({});
  const [showTreatmentOptions, setShowTreatmentOptions] = useState<boolean>(false);
  const [showPersonalDataForm, setShowPersonalDataForm] = useState<boolean>(false);
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoais>({
    nome: '',
    sobrenome: '',
    endereco: ''
  });
  const [detalhesCalvicie, setDetalhesCalvicie] = useState<Partial<DetalheCalvicie>>({});

  const prevTitle = useRef<string>('');
  const prevSubtitle = useRef<string>('');
  const [shouldAnimateHeader, setShouldAnimateHeader] = useState<boolean>(true);

  const handleTreatmentSelection = () => {
    const treatmentQuestion: Question = {
      pergunta: "Com base na sua avaliação, recomendamos os seguintes tratamentos. Qual você prefere?",
      opcoes: [
        "Finasterida 1mg (oral) + Minoxidil 5% Tópico - R$ 99,90/mês",
        "Dutasterida 0.5mg (oral) + Minoxidil 5% Tópico - R$ 119,90/mês",
        "Minoxidil 5% Tópico + Shampoo Antiqueda + Biotina - R$ 89,90/mês",
        "Minoxidil Oral 5mg + Finasterida 1mg - R$ 129,90/mês"
      ],
      "is_treatment_selection": true
    };
    setCurrentQuestion(treatmentQuestion);
    setShowTreatmentOptions(true);
  };

  const handlePersonalDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPersonalDataForm(false);
  };

  const handlePersonalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosPessoais(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderPersonalDataForm = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Dados Pessoais</h3>
        <form onSubmit={handlePersonalDataSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="nome"
              value={dadosPessoais.nome}
              onChange={handlePersonalDataChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sobrenome</label>
            <input
              type="text"
              name="sobrenome"
              value={dadosPessoais.sobrenome}
              onChange={handlePersonalDataChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Endereço</label>
            <input
              type="text"
              name="endereco"
              value={dadosPessoais.endereco}
              onChange={handlePersonalDataChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors mt-6"
          >
            Continuar
          </button>
        </form>
      </div>
    );
  };

  const getNextQuestionFromClaude = async (answer: string): Promise<Question | null> => {
    setIsLoading(true);
    setError(null);
    try {
      if (currentQuestion["input-text"]) {
        const isNumericQuestion = currentQuestion.pergunta.toLowerCase().match(/^(qual|digite|informe).*(idade)/);
        
        if (isNumericQuestion) {
          const numericAnswer = parseFloat(answer);
          if (isNaN(numericAnswer)) {
            throw new Error("Por favor, insira um número válido");
          }
          
          if (currentQuestion.pergunta.includes("idade")) {
            if (numericAnswer < 18) {
              setHasRedFlags(true);
            }
            setDadosBasicos(prev => ({ ...prev, idade: numericAnswer }));
          }
        } else {
          const minLength = isNumericQuestion ? 1 : 3;
          const maxLength = isNumericQuestion ? 4 : 500;
          if (answer.trim().length < minLength || answer.trim().length > maxLength) {
            throw new Error(`Por favor, forneça uma resposta ${answer.trim().length < minLength ? 'mais detalhada' : 'mais concisa'}`);
          }
        }
      }

      // Atualizar dados básicos com base nas respostas
      if (currentQuestion.pergunta.includes("padrão de calvície") || currentQuestion.pergunta.includes("status capilar")) {
        setDadosBasicos(prev => ({ ...prev, status_capilar: answer }));
      }

      // Atualizar detalhes da calvície com base nas respostas
      if (currentQuestion.pergunta.toLowerCase().includes("tempo") && currentQuestion.pergunta.toLowerCase().includes("queda")) {
        setDetalhesCalvicie(prev => ({ ...prev, tempo_inicio: answer }));
      } else if (currentQuestion.pergunta.toLowerCase().includes("padrão de queda")) {
        setDetalhesCalvicie(prev => ({ ...prev, padrao_queda: answer }));
      } else if (currentQuestion.pergunta.toLowerCase().includes("histórico familiar")) {
        setDetalhesCalvicie(prev => ({ ...prev, historico_familiar: answer }));
      } else if (currentQuestion.pergunta.toLowerCase().includes("tentativas anteriores") || currentQuestion.pergunta.toLowerCase().includes("tratamentos anteriores")) {
        setDetalhesCalvicie(prev => ({ ...prev, tratamentos_anteriores: answer }));
      }

      if (currentQuestion.is_red_flag && answer === currentQuestion.red_flag_value) {
        setHasRedFlags(true);
      }

      const newAnswers = [...answers, { 
        question: currentQuestion.pergunta, 
        answer,
        isRedFlag: currentQuestion.is_red_flag && answer === currentQuestion.red_flag_value
      }];
      setAnswers(newAnswers);

      const updatedMessages: Message[] = [
        { role: 'user', content: HAIR_GROWTH_SYSTEM_PROMPT },
        ...messages,
        { 
          role: 'user', 
          content: `Histórico completo de perguntas e respostas:
          ${newAnswers.map(a => `Pergunta: ${a.question}
          Resposta: ${a.answer}${a.isRedFlag ? ' (RED FLAG DETECTADA)' : ''}`).join('\n')}
          
          Perguntas já feitas: ${Array.from(askedQuestions).join(", ")}.
          Última resposta do usuário para a pergunta "${currentQuestion.pergunta}": ${answer}.
          Número de perguntas feitas desde o último fato curioso: ${questionCount % 5}
          Dados básicos coletados: ${JSON.stringify(dadosBasicos)}
          Detalhes da calvície coletados: ${JSON.stringify(detalhesCalvicie)}
          Red flags detectadas: ${hasRedFlags}
          Seleção de tratamento: ${showTreatmentOptions}
          
          IMPORTANTE: Retorne apenas UM objeto JSON. Se já foram feitas 4 perguntas desde o último fato curioso, retorne um fato curioso baseado nas respostas anteriores. Após o fato curioso, continue o fluxo de perguntas normalmente.` 
        }
      ];

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erro na resposta do Claude:', data);
        if (data.rawResponse) {
          console.error('Resposta raw do Claude:', data.rawResponse);
        }
        throw new Error(data.details || 'Falha na comunicação com o Claude');
      }

      if (!data.content?.[0]?.text?.value) {
        throw new Error('Resposta do Claude em formato inválido');
      }

      const assistantMessage = data.content[0].text.value;
      console.log('Mensagem do assistente:', assistantMessage);

      try {
        const cleanJson = assistantMessage.trim().replace(/```json\n?|\n?```/g, '');
        console.log('JSON limpo:', cleanJson);

        const parsed = JSON.parse(cleanJson) as Question;
        console.log('JSON parseado:', parsed);
        
        if (!askedQuestions.has(parsed.pergunta)) {
          setAskedQuestions(prev => new Set([...prev, parsed.pergunta]));
          setMessages(prev => [...prev, 
            { role: 'user', content: answer },
            { role: 'assistant', content: assistantMessage }
          ]);

          if (!parsed["did-you-know"]) {
            setQuestionCount(prev => prev + 1);
          } else {
            setQuestionCount(0);
          }

          return parsed;
        } else {
          console.log('Pergunta já feita:', parsed.pergunta);
          setError('O Claude tentou fazer uma pergunta repetida. Tentando novamente...');
          return null;
        }
      } catch (parseError) {
        console.error("Erro ao parsear resposta do Claude:", parseError);
        console.error("Conteúdo que causou o erro:", assistantMessage);
        throw new Error(`Erro ao processar resposta do Claude: ${parseError instanceof Error ? parseError.message : 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error("Erro ao obter próxima pergunta:", error);
      setError(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = async (answer: string) => {
    // Se for uma opção de recuperação de erro, reiniciar com a pergunta atual
    if (currentQuestion.error_recovery) {
      // Remover a pergunta atual do conjunto de perguntas já feitas para permitir fazê-la novamente
      const updatedAskedQuestions = new Set(askedQuestions);
      updatedAskedQuestions.delete(currentQuestion.pergunta);
      setAskedQuestions(updatedAskedQuestions);
      
      // Tentar novamente a partir da última pergunta não-erro
      const lastValidQuestion = answers.length > 0 
        ? answers[answers.length - 1].question 
        : fallbackChain[0].pergunta;
      
      const currentIndex = fallbackChain.findIndex((q: Question) => q.pergunta === lastValidQuestion);
      if (currentIndex >= 0 && currentIndex < fallbackChain.length - 1) {
        // Avançar para a próxima pergunta no fallback chain
        setCurrentQuestion(fallbackChain[currentIndex + 1]);
        setAskedQuestions(prev => new Set([...prev, fallbackChain[currentIndex + 1].pergunta]));
      } else {
        // Voltar para a primeira pergunta se não encontrar a pergunta atual no fallback
        setCurrentQuestion(fallbackChain[0]);
        setAskedQuestions(new Set([fallbackChain[0].pergunta]));
      }
      return;
    }
    
    if (currentQuestion.is_treatment_selection) {
      // Extrair nome e preço do tratamento selecionado
      const tratamentoNome = answer.split(" - ")[0];
      const tratamentoPreco = parseFloat(answer.split("R$ ")[1].split("/mês")[0].replace(",", ".").trim());
      
      const currentSummary = {
        dados_basicos: dadosBasicos as DadosBasicos,
        contraindicacoes: [],
        condicoes_relevantes: [],
        detalhes_calvicie: detalhesCalvicie as DetalheCalvicie,
        elegivel_tratamento: true,
        tratamentos_recomendados: [{
          nome: tratamentoNome,
          preco: tratamentoPreco,
          descricao: answer,
          contraindicacoes_especificas: []
        }]
      };

      const treatmentSummary: Question = {
        pergunta: "Resumo do tratamento selecionado",
        "last_step": "true",
        "summary": currentSummary
      };
      setCurrentQuestion(treatmentSummary);
      return;
    }

    try {
      const nextQuestion = await getNextQuestionFromClaude(answer);
      if (nextQuestion) {
        // Verificar se a resposta é uma mensagem de erro de recuperação
        if (nextQuestion.error_recovery) {
          console.log("Resposta de recuperação de erro recebida:", nextQuestion);
          setCurrentQuestion(nextQuestion);
          // Não incrementar o passo atual já que estamos em modo de recuperação
        } else {
          // Resposta normal - avançar para a próxima pergunta
          setCurrentQuestion(nextQuestion);
          setCurrentStep(prev => prev + 1);
          setTextInput('');
        }
      } else {
        // Fallback para a próxima pergunta na cadeia
        const currentIndex = fallbackChain.findIndex((q: Question) => q.pergunta === currentQuestion.pergunta);
        if (currentIndex < fallbackChain.length - 1) {
          setCurrentQuestion(fallbackChain[currentIndex + 1]);
          setAskedQuestions(prev => new Set([...prev, fallbackChain[currentIndex + 1].pergunta]));
        }
      }
    } catch (error) {
      console.error("Erro ao processar resposta:", error);
      
      // Criar uma pergunta de recuperação ao invés de simplesmente avançar
      const errorRecoveryQuestion: Question = {
        pergunta: `Ocorreu um erro ao processar sua resposta. Por favor, tente novamente.`,
        opcoes: ["Tentar novamente"],
        "error_recovery": true
      };
      setCurrentQuestion(errorRecoveryQuestion);
      setError(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      await handleOptionSelect(textInput);
    }
  };

  const handleContinue = () => {
    // Implementar lógica de fallback direta para o did-you-know
    // Isso evita o uso de API quando o problema tipicamente ocorre
    if (currentQuestion["did-you-know"]) {
      try {
        // Primeiro tentamos avançar para a próxima pergunta da cadeia de fallback
        // sem depender da API, que pode falhar após um did-you-know
        const lastValidAnswer = answers.length > 0 ? 
          answers[answers.length - 1].answer : "";
        
        // Determinar qual é a próxima pergunta no fluxo
        // Se existirem menos de 4 perguntas no fallback chain, use a próxima
        // Caso contrário, use uma pergunta genérica sobre tratamentos
        const currentIndex = fallbackChain.findIndex(
          (q: Question) => q.pergunta === currentQuestion.pergunta
        );
        
        // Se encontrou a pergunta atual no fallback chain, avance para a próxima
        if (currentIndex >= 0 && currentIndex < fallbackChain.length - 1) {
          console.log("Avançando para a próxima pergunta no fallback chain após did-you-know");
          const nextQuestion = fallbackChain[currentIndex + 1];
          setCurrentQuestion(nextQuestion);
          setCurrentStep(prev => prev + 1);
          setAskedQuestions(prev => new Set([...prev, nextQuestion.pergunta]));
          return;
        }
        
        // Se não encontrou no fallback chain, vamos criar uma pergunta sobre tratamentos anteriores
        const genericNextQuestion: Question = {
          pergunta: "Você já tentou algum tratamento para queda de cabelo anteriormente?",
          opcoes: ["Sim, com bons resultados", "Sim, sem resultados", "Não, nunca tentei"]
        };
        
        console.log("Usando pergunta genérica após did-you-know");
        setCurrentQuestion(genericNextQuestion);
        setCurrentStep(prev => prev + 1);
        setAskedQuestions(prev => new Set([...prev, genericNextQuestion.pergunta]));
        return;
      } catch (error) {
        console.error("Erro ao processar did-you-know com fallback:", error);
        // Se o fallback falhar, tenta o método regular como último recurso
      }
    }
  
    // Método regular como backup
    try {
      handleOptionSelect("Entendi");
    } catch (error) {
      console.error("Erro ao processar resposta para did-you-know:", error);
      
      // Fallback de segurança - sempre ir para a próxima pergunta no fallback chain
      const nextQuestion = fallbackChain[1]; // Sempre vá para a segunda pergunta, a primeira é idade
      setCurrentQuestion(nextQuestion);
      setCurrentStep(prev => prev + 1);
      setAskedQuestions(prev => new Set([...prev, nextQuestion.pergunta]));
    }
  };

  const renderSummary = () => {
    if (!currentQuestion.summary) return null;
    
    const { dados_basicos, contraindicacoes, condicoes_relevantes, detalhes_calvicie, elegivel_tratamento, tratamentos_recomendados } = currentQuestion.summary;
    
    return (
      <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
        <h3 className="text-xl font-bold">Resumo da Triagem</h3>
        
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Dados Básicos</h4>
          <p>Idade: {dados_basicos.idade} anos</p>
          <p>Status Capilar: {dados_basicos.status_capilar}</p>
        </div>

        {contraindicacoes.length > 0 && (
          <div className="bg-red-50 p-4 rounded">
            <h4 className="font-semibold mb-2 text-red-700">Contraindicações Identificadas</h4>
            <ul className="list-disc pl-5">
              {contraindicacoes.map((item, index) => (
                <li key={index} className="text-red-600">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {condicoes_relevantes.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Condições Relevantes</h4>
            <ul className="list-disc pl-5">
              {condicoes_relevantes.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Detalhes da Calvície</h4>
          <p>Tempo de Início: {detalhes_calvicie.tempo_inicio}</p>
          <p>Padrão de Queda: {detalhes_calvicie.padrao_queda}</p>
          <p>Histórico Familiar: {detalhes_calvicie.historico_familiar}</p>
          <p>Tratamentos Anteriores: {detalhes_calvicie.tratamentos_anteriores}</p>
        </div>

        <div className={`p-4 rounded ${elegivel_tratamento ? 'bg-green-50' : 'bg-red-50'}`}>
          <h4 className="font-semibold mb-2">Conclusão</h4>
          <p className={elegivel_tratamento ? 'text-green-700' : 'text-red-700'}>
            {elegivel_tratamento 
              ? 'Elegível para o programa de tratamento capilar.' 
              : 'Não elegível para o programa de tratamento capilar neste momento.'}
          </p>
          {elegivel_tratamento && !showTreatmentOptions && !tratamentos_recomendados && (
            <button
              onClick={handleTreatmentSelection}
              className="mt-4 bg-rose-500 text-white px-6 py-2 rounded hover:bg-rose-600 transition-colors"
            >
              Entender Tratamento
            </button>
          )}
        </div>

        {tratamentos_recomendados && tratamentos_recomendados.length > 0 && (
          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Tratamento Selecionado</h4>
            {tratamentos_recomendados.map((tratamento, index) => (
              <div key={index} className="space-y-2">
                <p className="font-medium">{tratamento.nome}</p>
                <p>{tratamento.descricao}</p>
                {tratamento.contraindicacoes_especificas && tratamento.contraindicacoes_especificas.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium text-amber-700">Atenção:</p>
                    <ul className="list-disc pl-5">
                      {tratamento.contraindicacoes_especificas.map((item, idx) => (
                        <li key={idx} className="text-amber-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {!showPersonalDataForm && (
              <button
                onClick={() => setShowPersonalDataForm(true)}
                className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors mt-6"
              >
                Prosseguir com Cadastro
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const getStepContent = () => {
    // Textos dinâmicos baseados na etapa atual
    if (currentQuestion["last_step"] === "true") {
      return {
        title: "Seu plano personalizado está pronto",
        subtitle: "Revise suas informações e escolha a melhor opção de tratamento para você"
      };
    }

    if (showTreatmentOptions) {
      return {
        title: "Escolha seu plano ideal",
        subtitle: "Compare as opções e selecione o tratamento que melhor atende suas necessidades"
      };
    }

    if (currentQuestion.pergunta?.toLowerCase().includes("idade") ||
        currentQuestion.pergunta.toLowerCase().includes("padrão de calvície")) {
      return {
        title: "Vamos começar com seus dados básicos",
        subtitle: "Estas informações são essenciais para personalizar seu plano"
      };
    }

    if (currentQuestion["did-you-know"]) {
      return {
        title: "Você sabia?",
        subtitle: "Descubra informações importantes sobre saúde capilar"
      };
    }

    const defaultContent = {
      title: "Tratamento capilar personalizado",
      subtitle: "Vamos personalizar um tratamento baseado em suas necessidades"
    };
    
    return defaultContent;
  };

  useEffect(() => {
    const currentContent = getStepContent();
    
    // Verifica se o título ou subtítulo mudaram
    if (
      currentContent.title !== prevTitle.current ||
      currentContent.subtitle !== prevSubtitle.current
    ) {
      setShouldAnimateHeader(true);
      prevTitle.current = currentContent.title;
      prevSubtitle.current = currentContent.subtitle;
    } else {
      setShouldAnimateHeader(false);
    }
  }, [currentQuestion]);

  const headerContent = getStepContent();

  const renderProgressBar = () => {
    const maxProgress = Math.min(currentStep * 5, 100); // Cada etapa aumenta 5%, máximo 100%
    const isFullButNotFinished = maxProgress === 100 && !currentQuestion["last_step"];
    
    return (
      <div className="w-full mb-12">
        <div className="relative h-1">
          {/* Linha do tempo completa */}
          <div className="absolute w-full h-full flex justify-between">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-gray-200 transform translate-y-0" />
            ))}
          </div>
          {/* Barra de progresso */}
          <div className="absolute w-full h-full bg-gray-200 rounded-full" />
          <div 
            className={`
              absolute h-full bg-[#8A3A34] rounded-full transition-all duration-2100 ease-in-out
              ${isFullButNotFinished ? 'animate-progress-pulse' : ''}
            `}
            style={{ width: `${maxProgress}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-white flex flex-col items-center px-4 sm:px-8 pt-6 sm:pt-12 pb-4 sm:pb-8 max-w-2xl mx-auto overflow-hidden">
      {!currentQuestion["did-you-know"] && renderProgressBar()}
      <div
        key={currentStep}
        className={`${shouldAnimateHeader ? 'animate-fade-slide-down' : ''} transition-all duration-700 ease-in-out w-full`}
      >
        {!currentQuestion["did-you-know"] && <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#8A3A34] to-gray-800 bg-clip-text text-transparent text-center max-w-xl mx-auto leading-relaxed tracking-tight">
          {headerContent.title}
        </h1>
}
        {!currentQuestion["did-you-know"] && <p className="text-lg sm:text-xl text-gray-500 mb-8 sm:mb-16 text-center max-w-xl leading-relaxed mx-auto">
          {headerContent.subtitle}
        </p>
}
      </div>

      <div className="w-full max-w-lg flex-1 min-h-0 flex flex-col">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8A3A34]"></div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            {showPersonalDataForm ? (
              renderPersonalDataForm()
            ) : currentQuestion["last_step"] === "true" ? (
              renderSummary()
            ) : currentQuestion.opcoes && currentQuestion.opcoes.length > 0 ? (
              <>
                <div className="overflow-hidden">
                  <div
                    key={`question-${currentStep}-${currentQuestion.pergunta}`}
                    className="animate-fade-slide-down transition-all duration-500 ease-out"
                  >
                    <p className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 text-gray-800 text-center">{currentQuestion.pergunta}</p>
                  </div>
                </div>
                
                {currentQuestion.image_selection ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(currentQuestion.opcoes as ImageOption[]).map((opcao, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(opcao.text)}
                        className="flex flex-col items-center p-0 rounded-xl border border-gray-200 hover:border-[#8A3A34] hover:shadow-md transition-all duration-300 overflow-hidden"
                      >
                        <div className="relative w-full h-56">
                          <img
                            src={opcao.imageUrl}
                            alt={opcao.text}
                            className="w-full h-full object-cover"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-white to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <span className="text-center font-medium text-gray-800 block">{opcao.text}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(currentQuestion.opcoes as string[]).map((opcao, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(opcao)}
                        className="w-full text-left px-6 sm:px-8 py-4 sm:py-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 text-gray-700"
                      >
                        {opcao}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : currentQuestion["input-text"] ? (
              <>
                <div className="overflow-hidden">
                  <div
                    key={`question-${currentStep}-${currentQuestion.pergunta}`}
                    className="animate-fade-slide-down transition-all duration-500 ease-out"
                  >
                    <p className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 text-gray-800 text-center">{currentQuestion.pergunta}</p>
                  </div>
                </div>
                <form onSubmit={handleTextSubmit} className="space-y-3">
                  {currentQuestion.pergunta.toLowerCase().includes("idade") ? (
                    <input
                      type="number"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      min="18"
                      max="120"
                      className="w-full px-6 py-4 border border-gray-200 rounded-lg focus:border-gray-300 focus:ring-1 focus:ring-gray-300 text-gray-800 text-lg transition-all duration-200"
                      placeholder="Digite sua idade..."
                    />
                  ) : (
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="w-full px-6 py-4 border border-gray-200 rounded-lg focus:border-gray-300 focus:ring-1 focus:ring-gray-300 text-gray-800 text-lg min-h-[120px] transition-all duration-200"
                      placeholder="Descreva detalhadamente sua resposta..."
                      rows={4}
                    />
                  )}
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors mt-6"
                    disabled={!textInput.trim() || isLoading}
                  >
                    Enviar
                  </button>
                </form>
              </>
            ) : currentQuestion["did-you-know"] ? (
              <div className="overflow-hidden">
                <div 
                  key={`fact-${currentStep}-${currentQuestion.pergunta}`}
                  style={{ transform: 'translate3d(0,0,0)' }}
                  className="animate-fade-slide-down transition-all duration-500 ease-out"
                >
                  <div className="space-y-6 sm:space-y-8 pt-8 sm:pt-12">
                    <p className="text-3xl sm:text-4xl font-medium text-[#8A3A34]/80 text-center">
                    [e]
                    </p>
                  <div className="space-y-6">
                    {currentQuestion.pergunta.split('\n').map((paragraph, index) => (
                      <p 
                        key={index}
                        className={`text-xl sm:text-2xl leading-relaxed text-[#8A3A34]/80 text-center
                          ${index === 0 ? 'font-medium' : 'font-normal opacity-90'}`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={handleContinue}
                      className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 
transition-colors flex items-center justify-center gap-2"
                    >
                      Continuar
                      <span className="text-xl">→</span>
                    </button>
                  </div>
                </div>
              </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default HairGrowthScreening;
