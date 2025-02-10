import React, { useState } from 'react';
import { WEIGHT_LOSS_SYSTEM_PROMPT } from '../constants/prompts';

interface DadosBasicos {
  idade: number;
  peso: number;
  altura: number;
  imc: number;
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

  const calculateIMC = (peso: number, altura: number): number => {
    const alturaMetros = altura / 100;
    return Number((peso / (alturaMetros * alturaMetros)).toFixed(1));
  };

  // Determina o endpoint baseado no ambiente
  const API_ENDPOINT = import.meta.env.PROD 
    ? 'https://eles-saude-masc.netlify.app/.netlify/functions/claude-proxy'
    : '/.netlify/functions/claude-proxy';

  const handleTreatmentSelection = async () => {
    setShowTreatmentOptions(true);
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
  };

  const getNextQuestionFromClaude = async (answer: string): Promise<Question | null> => {
    setIsLoading(true);
    setError(null);
    try {
      if (currentQuestion["input-text"]) {
        const numericAnswer = parseFloat(answer);
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
              if (newDados.imc < 30) {
                setHasRedFlags(true);
              }
            }
            return newDados;
          });
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

      console.log('Enviando mensagens para o Claude:', JSON.stringify(updatedMessages, null, 2));

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

      console.log('Resposta recebida do Claude:', JSON.stringify(data, null, 2));

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
      // Finalizar com a seleção do tratamento
      const treatmentSummary: Question = {
        pergunta: "Resumo do tratamento selecionado",
        "last_step": "true",
        "summary": {
          ...currentQuestion.summary!,
          tratamentos_indicados: [{
            nome: answer.split(" - ")[0],
            preco: parseFloat(answer.split("R$ ")[1].split(",")[0].replace(".", "")),
            descricao: answer
          }]
        }
      };
      setCurrentQuestion(treatmentSummary);
      return;
    }

    try {
      const nextQuestion = await getNextQuestionFromClaude(answer);
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        setTextInput('');
      } else {
        const currentIndex = fallbackChain.findIndex(q => q.pergunta === currentQuestion.pergunta);
        if (currentIndex < fallbackChain.length - 1) {
          setCurrentQuestion(fallbackChain[currentIndex + 1]);
          setAskedQuestions(prev => new Set([...prev, fallbackChain[currentIndex + 1].pergunta]));
        }
      }
    } catch (error) {
      console.error("Erro ao processar resposta:", error);
      const currentIndex = fallbackChain.findIndex(q => q.pergunta === currentQuestion.pergunta);
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
          {elegivel_tratamento && !showTreatmentOptions && (
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
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Triagem para Emagrecimento</h1>
      <div className="bg-white shadow p-6 rounded w-full max-w-lg">
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
            {currentQuestion["last_step"] === "true" ? (
              renderSummary()
            ) : currentQuestion.opcoes && currentQuestion.opcoes.length > 0 ? (
              <>
                <p className="text-xl font-semibold mb-4">{currentQuestion.pergunta}</p>
                <div className="space-y-3">
                  {currentQuestion.opcoes.map((opcao, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(opcao)}
                      className="w-full text-left border rounded p-2 hover:bg-rose-100"
                    >
                      {opcao}
                    </button>
                  ))}
                </div>
              </>
            ) : currentQuestion["input-text"] ? (
              <>
                <p className="text-xl font-semibold mb-4">{currentQuestion.pergunta}</p>
                <form onSubmit={handleTextSubmit} className="space-y-3">
                  <input
                    type="number"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Digite sua resposta aqui..."
                  />
                  <button
                    type="submit"
                    className="w-full bg-rose-500 text-white px-4 py-2 rounded"
                    disabled={!textInput.trim()}
                  >
                    Enviar
                  </button>
                </form>
              </>
            ) : currentQuestion["did-you-know"] ? (
              <div>
                <p className="mt-4 italic text-gray-500">
                  Você sabia?
                </p>
                <p className="mt-2 text-lg">
                  {currentQuestion.pergunta}
                </p>
                <button
                  onClick={handleContinue}
                  className="mt-4 bg-rose-500 text-white px-4 py-2 rounded"
                >
                  Continuar
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default WeightLossScreening;