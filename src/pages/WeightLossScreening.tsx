import React, { useState } from 'react';
import { WEIGHT_LOSS_SYSTEM_PROMPT } from '../constants/prompts';

interface DadosBasicos {
  idade: number;
  peso: number;
  altura: number;
  imc: number;
}

interface DadosPessoais {
  nome: string;
  sobrenome: string;
  endereco: string;
}

interface EstiloVida {
  atividade_fisica: string;
  padrao_alimentar: string;
  qualidade_sono: string;
}

interface Tratamento {
  nome: string;
  preco: number;
  descricao: string;
}

interface Summary {
  dados_basicos: DadosBasicos;
  dados_pessoais?: DadosPessoais;
  contraindicacoes: string[];
  condicoes_relevantes: string[];
  estilo_vida: EstiloVida;
  elegivel_tratamento: boolean;
  tratamentos_indicados?: Tratamento[];
}

interface Question {
  pergunta: string;
  opcoes?: string[];
  "did-you-know"?: boolean;
  "last_step"?: string;
  "input-text"?: boolean;
  "is_red_flag"?: boolean;
  "red_flag_value"?: string;
  "red_flags_detected"?: boolean;
  "summary"?: Summary;
  "show_treatment_button"?: boolean;
  "is_treatment_selection"?: boolean;
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
    pergunta: "Qual é o seu peso atual (em kg)?",
    "input-text": true
  },
  {
    pergunta: "Qual é a sua altura (em cm)?",
    "input-text": true
  },
  {
    pergunta: "Você tem histórico de transtornos alimentares?",
    opcoes: ["Sim", "Não"],
    "is_red_flag": true,
    "red_flag_value": "Sim"
  },
  {
    pergunta: "Você está grávida ou amamentando?",
    opcoes: ["Sim", "Não"],
    "is_red_flag": true,
    "red_flag_value": "Sim"
  }
];

function WeightLossScreening() {
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
  const [hasComorbidities, setHasComorbidities] = useState<boolean>(false);
  const [showPersonalDataForm, setShowPersonalDataForm] = useState<boolean>(false);
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoais>({
    nome: '',
    sobrenome: '',
    endereco: ''
  });

  const calculateIMC = (peso: number, altura: number): number => {
    const alturaMetros = altura / 100;
    return Number((peso / (alturaMetros * alturaMetros)).toFixed(1));
  };

  const checkIMCEligibility = (imc: number): boolean => {
    if (imc >= 30) return true;
    if (imc > 27 && imc < 30 && hasComorbidities) return true;
    return false;
  };

  const handleTreatmentSelection = () => {
    const treatmentQuestion: Question = {
      pergunta: "Qual faixa de preço de tratamento melhor atende suas necessidades?",
      opcoes: [
        "Contrave (Bupropiona + Naltrexona) - Aproximadamente R$ 400,00 por mês",
        "Ozempic - Aproximadamente R$ 1.000,00 por mês",
        "Saxenda - Aproximadamente R$ 1.800,00 por mês"
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
        const isNumericQuestion = currentQuestion.pergunta.toLowerCase().match(/^(qual|digite|informe).*(idade|peso|altura)/);
        
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
          } else if (currentQuestion.pergunta.includes("peso")) {
            setDadosBasicos(prev => ({ ...prev, peso: numericAnswer }));
          } else if (currentQuestion.pergunta.includes("altura")) {
            const altura = numericAnswer;
            setDadosBasicos(prev => {
              const newDados = { ...prev, altura };
              if (newDados.peso) {
                newDados.imc = calculateIMC(newDados.peso, altura);
                setHasRedFlags(!checkIMCEligibility(newDados.imc));
              }
              return newDados;
            });
        }
     } else {
        const minLength = isNumericQuestion ? 1 : 3;
        const maxLength = isNumericQuestion ? 4 : 500;
        if (answer.trim().length < minLength || answer.trim().length > maxLength) {
         throw new Error(`Por favor, forneça uma resposta ${answer.trim().length < minLength ? 'mais detalhada' : 'mais concisa'}`);
        }
      }
      }

      // Verificar respostas sobre comorbidades
      if (currentQuestion.pergunta.toLowerCase().includes("diabetes") || 
          currentQuestion.pergunta.toLowerCase().includes("hipertensão")) {
        if (answer.toLowerCase() === "sim") {
          setHasComorbidities(true);
          if (dadosBasicos.imc) {
            setHasRedFlags(!checkIMCEligibility(dadosBasicos.imc));
          }
        }
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
        { role: 'user', content: WEIGHT_LOSS_SYSTEM_PROMPT },
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
    if (currentQuestion.is_treatment_selection) {
      const currentSummary = {
        dados_basicos: dadosBasicos as DadosBasicos,
        contraindicacoes: [],
        condicoes_relevantes: [],
        estilo_vida: {
          atividade_fisica: answers.find(a => a.question.toLowerCase().includes("atividade"))?.answer || "",
          padrao_alimentar: answers.find(a => a.question.toLowerCase().includes("padrão alimentar") || a.question.toLowerCase().includes("hábitos alimentares"))?.answer || "Não informado",
          qualidade_sono: answers.find(a => a.question.toLowerCase().includes("sono"))?.answer || ""
        },
        elegivel_tratamento: true,
        tratamentos_indicados: [{
          nome: answer.split(" - ")[0],
          preco: parseFloat(answer.split("R$ ")[1].split(",")[0].replace(".", "").trim()),
          descricao: answer
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
        setCurrentQuestion(nextQuestion);
        setCurrentStep(prev => prev + 1);
        setTextInput('');
      } else {
        const currentIndex = fallbackChain.findIndex((q: Question) => q.pergunta === currentQuestion.pergunta);
        if (currentIndex < fallbackChain.length - 1) {
          setCurrentQuestion(fallbackChain[currentIndex + 1]);
          setAskedQuestions(prev => new Set([...prev, fallbackChain[currentIndex + 1].pergunta]));
        }
      }
    } catch (error) {
      console.error("Erro ao processar resposta:", error);
      const currentIndex = fallbackChain.findIndex((q: Question) => q.pergunta === currentQuestion.pergunta);
      if (currentIndex < fallbackChain.length - 1) {
        setCurrentQuestion(fallbackChain[currentIndex + 1]);
        setAskedQuestions(prev => new Set([...prev, fallbackChain[currentIndex + 1].pergunta]));
      }
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      await handleOptionSelect(textInput);
    }
  };

  const handleContinue = () => {
    handleOptionSelect("Entendi");
  };

  const renderSummary = () => {
    if (!currentQuestion.summary) return null;
    
    const { dados_basicos, contraindicacoes, condicoes_relevantes, estilo_vida, elegivel_tratamento, tratamentos_indicados } = currentQuestion.summary;
    
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Resumo da Triagem</h3>
        
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Dados Básicos</h4>
          <p>Idade: {dados_basicos.idade} anos</p>
          <p>Peso: {dados_basicos.peso} kg</p>
          <p>Altura: {dados_basicos.altura} cm</p>
          <p>IMC: {dados_basicos.imc}</p>
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
          <h4 className="font-semibold mb-2">Estilo de Vida</h4>
          <p>Atividade Física: {estilo_vida.atividade_fisica}</p>
          <p>Padrão Alimentar: {estilo_vida.padrao_alimentar}</p>
          <p>Qualidade do Sono: {estilo_vida.qualidade_sono}</p>
        </div>

        <div className={`p-4 rounded ${elegivel_tratamento ? 'bg-green-50' : 'bg-red-50'}`}>
          <h4 className="font-semibold mb-2">Conclusão</h4>
          <p className={elegivel_tratamento ? 'text-green-700' : 'text-red-700'}>
            {elegivel_tratamento 
              ? 'Elegível para o programa de emagrecimento.' 
              : 'Não elegível para o programa de emagrecimento neste momento.'}
          </p>
          {elegivel_tratamento && !showTreatmentOptions && !tratamentos_indicados && (
            <button
              onClick={handleTreatmentSelection}
              className="mt-4 bg-rose-500 text-white px-6 py-2 rounded hover:bg-rose-600 transition-colors"
            >
              Entender Tratamento
            </button>
          )}
        </div>

        {tratamentos_indicados && tratamentos_indicados.length > 0 && (
          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Tratamento Selecionado</h4>
            {tratamentos_indicados.map((tratamento, index) => (
              <div key={index} className="space-y-2">
                <p className="font-medium">{tratamento.nome}</p>
                <p>{tratamento.descricao}</p>
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

  const getStepContent = (): { title: string; subtitle: string } => {
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
        currentQuestion.pergunta.toLowerCase().includes("peso") || 
        currentQuestion.pergunta.toLowerCase().includes("altura")) {
      return {
        title: "Vamos começar com seus dados básicos",
        subtitle: "Estas informações são essenciais para personalizar seu plano"
      };
    }

    if (currentQuestion["did-you-know"]) {
      return {
        title: "Você sabia?",
        subtitle: "Descubra informações importantes sobre saúde e bem-estar"
      };
    }

    const defaultContent = {
      title: "Explore planos de emagrecimento",
      subtitle: "Vamos personalizar um tratamento baseado em suas necessidades"
    };
    
    return defaultContent;
  };

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
              absolute h-full bg-rose-500 rounded-full transition-all duration-2100 ease-in-out
              ${isFullButNotFinished ? 'animate-progress-pulse' : ''}
            `}
            style={{ width: `${maxProgress}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-white flex flex-col items-center px-4 sm:px-8 pt-6 sm:pt-12 pb-4 sm:pb-8 max-w-2xl mx-auto overflow-y-auto">
      {!currentQuestion["did-you-know"] && renderProgressBar()}
      <div
 
        key={currentStep}
        className="animate-fade-slide-down transition-all duration-700 ease-in-out w-full"
      >
        {!currentQuestion["did-you-know"] && <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-rose-500 to-gray-800 bg-clip-text text-transparent text-center max-w-xl mx-auto leading-tight tracking-tight">
          {getStepContent().title}
        </h1>
}
        {!currentQuestion["did-you-know"] && <p className="text-lg sm:text-xl text-gray-500 mb-8 sm:mb-16 text-center max-w-xl leading-relaxed mx-auto">

          {getStepContent().subtitle}
        </p>
}
      </div>

      <div className="w-full max-w-lg">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
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
                <div
 className="overflow-hidden"
>
                  <div
                    key={`question-${currentStep}-${currentQuestion.pergunta}`}
                  className="animate-fade-slide-down transition-all duration-500 ease-out"
                  >
                    <p className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 text-gray-800 text-center">{currentQuestion.pergunta}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {currentQuestion.opcoes.map((opcao, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(opcao)}
                      className="w-full text-left px-6 sm:px-8 py-4 sm:py-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 text-gray-700"
                    >
                      {opcao}
                    </button>
                  ))}
                </div>
              </>
            ) : currentQuestion["input-text"] ? (
              <>
                <div
 className="overflow-hidden"
>
                  <div
                    key={`question-${currentStep}-${currentQuestion.pergunta}`}
                  className="animate-fade-slide-down transition-all duration-500 ease-out"
                  >
                    <p className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 text-gray-800 text-center">{currentQuestion.pergunta}</p>
                  </div>
                </div>
                <form onSubmit={handleTextSubmit} className="space-y-3">
                  {(currentQuestion.pergunta.toLowerCase().includes("idade") ||
                   currentQuestion.pergunta.toLowerCase().includes("peso") ||
                   currentQuestion.pergunta.toLowerCase().includes("altura")) ? (
                    <input
                      type="number"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      min={currentQuestion.pergunta.toLowerCase().includes("idade") ? "18" : "1"}
                      max={currentQuestion.pergunta.includes("idade") ? "120" : 
                          currentQuestion.pergunta.includes("peso") ? "300" :
                          currentQuestion.pergunta.includes("altura") ? "250" : undefined}
                      step={currentQuestion.pergunta.includes("altura") ? "1" : "0.1"}
                      className="w-full px-6 py-4 border border-gray-200 rounded-lg focus:border-gray-300 focus:ring-1 focus:ring-gray-300 text-gray-800 text-lg transition-all duration-200"
                      placeholder={`Digite ${currentQuestion.pergunta.toLowerCase().includes("idade") ? "sua idade" :
                                  currentQuestion.pergunta.toLowerCase().includes("peso") ? "seu peso em kg" :
                                  currentQuestion.pergunta.toLowerCase().includes("altura") ? "sua altura em cm" : ""}...`}
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
              <div
 className="overflow-hidden"
>
                <div 
                  key={`fact-${currentStep}-${currentQuestion.pergunta}`}
                  style={{ transform: 'translate3d(0,0,0)' }}
                  className="animate-fade-slide-down transition-all duration-500 ease-out"
                >
                  <div className="space-y-6 sm:space-y-8 pt-8 sm:pt-12">
                    <p className="text-3xl sm:text-4xl font-medium text-rose-300/80 text-center">
                    [e]
                    </p>
                  <div className="space-y-6">
                    {currentQuestion.pergunta.split('\n').map((paragraph, index) => (
                      <p 
                        key={index}
                        className={`text-xl sm:text-2xl leading-relaxed text-rose-700/80 text-center
                          ${index === 0 ? 'font-medium' : 'font-normal opacity-90'}`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="flex justify-end mt-12">
                    <button
                       onClick={handleContinue}
                      className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 
transition-colors flex items-center gap-2"
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

export default WeightLossScreening;