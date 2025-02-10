import React, { useState } from 'react';

interface Question {
  pergunta: string;
  opcoes: string[];
  "did-you-know"?: boolean;
  "last_step"?: string;
  "input-text"?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const fallbackChain: Question[] = [
  {
    pergunta: "Qual é o seu objetivo no emagrecimento?",
    opcoes: [
      "Perder entre 1 e 7 kg",
      "Perder entre 7 e 20 kg",
      "Perder mais do que 20 kg",
      "Não tenho certeza! Preciso apenas emagrecer"
    ]
  },
  {
    pergunta: "Qual sua frequência de atividade física semanal?",
    opcoes: ["Nenhuma", "1-2 vezes", "3-4 vezes", "5 ou mais vezes"]
  },
  {
    pergunta: "Como você descreveria seus hábitos alimentares atuais?",
    opcoes: [
      "Como de forma desregrada",
      "Como regularmente, mas não controlo porções",
      "Sigo uma dieta específica",
      "Tenho restrições alimentares"
    ]
  },
  {
    pergunta: "Quantas horas você costuma dormir por noite?",
    opcoes: [
      "Menos de 6 horas",
      "6-7 horas",
      "7-8 horas",
      "Mais de 8 horas"
    ]
  },
  {
    pergunta: "Você tem alguma condição médica que afete seu peso?",
    opcoes: [
      "Não tenho nenhuma condição",
      "Sim, problemas na tireoide",
      "Sim, diabetes",
      "Sim, outras condições"
    ],
    "last_step": "true"
  }
];

const SYSTEM_PROMPT = `Você é o assistente virtual de um centro médico especializado em programas de emagrecimento com supervisão médica. Seu papel é realizar a triagem inicial dos pacientes, coletando informações cruciais para avaliar a adequação dos tratamentos oferecidos.

INSTRUÇÕES:
- Não repita perguntas já feitas
- Atue como um profissional de saúde experiente
- Colete informações através de perguntas de múltipla escolha
- IMPORTANTE: Retorne apenas UM objeto JSON por resposta
- Se precisar incluir um fato curioso, faça isso em uma interação separada
- Retorne no formato:

Para perguntas normais:
{
  "pergunta": "Sua pergunta aqui",
  "opcoes": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"]
}

Para fatos curiosos (em uma interação separada):
{
  "pergunta": "Seu fato curioso aqui",
  "opcoes": [],
  "did-you-know": true
}

Para finalizar:
{
  "pergunta": "Mensagem de agradecimento",
  "opcoes": [],
  "last_step": "true"
}

Colete informações sobre:
1. Histórico de tentativas de perda de peso
2. Condições médicas relevantes
3. Uso atual de medicamentos
4. Histórico familiar
5. Nível de atividade física
6. Hábitos alimentares
7. Expectativas quanto ao tratamento
8. Preocupações sobre medicamentos

IMPORTANTE: Retorne apenas UM objeto JSON por resposta, sem texto adicional.`;

function WeightLossScreening() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(fallbackChain[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set([fallbackChain[0].pergunta]));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Determina o endpoint baseado no ambiente
  const API_ENDPOINT = import.meta.env.PROD 
    ? 'https://eles-saude-masc.netlify.app/.netlify/functions/claude-proxy'
    : '/.netlify/functions/claude-proxy';

  const getNextQuestionFromClaude = async (answer: string): Promise<Question | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedMessages: Message[] = [
        { role: 'user', content: SYSTEM_PROMPT },
        ...messages,
        { 
          role: 'user', 
          content: `Histórico de perguntas já feitas: ${Array.from(askedQuestions).join(", ")}. 
          Última resposta do usuário para a pergunta "${currentQuestion.pergunta}": ${answer}.
          
          IMPORTANTE: Retorne apenas UM objeto JSON, sem texto adicional.` 
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
        // Remover possíveis caracteres extras ou quebras de linha
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
          return parsed;
        } else {
          console.log('Pergunta já feita:', parsed.pergunta);
          setError('O Claude tentou fazer uma pergunta repetida. Tentando novamente...');
          return null;
        }
      } catch (parseError) {
        console.error("Erro ao parsear resposta do Claude:", parseError);
        console.error("Conteúdo que causou o erro:", assistantMessage);
        setError(`Erro ao processar resposta do Claude: ${parseError instanceof Error ? parseError.message : 'Erro desconhecido'}`);
        throw parseError;
      }
      
      return null;
    } catch (error) {
      console.error("Erro ao obter próxima pergunta:", error);
      setError(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = async (answer: string) => {
    try {
      const nextQuestion = await getNextQuestionFromClaude(answer);
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
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

  const handleContinue = () => {
    const currentIndex = fallbackChain.findIndex(q => q.pergunta === currentQuestion.pergunta);
    if (currentIndex < fallbackChain.length - 1) {
      setCurrentQuestion(fallbackChain[currentIndex + 1]);
      setAskedQuestions(prev => new Set([...prev, fallbackChain[currentIndex + 1].pergunta]));
    }
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
            <p className="text-xl font-semibold mb-4">{currentQuestion.pergunta}</p>
            {currentQuestion.opcoes && currentQuestion.opcoes.length > 0 ? (
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
            ) : currentQuestion["did-you-know"] ? (
              <div>
                <p className="mt-4 italic text-gray-500">
                  Dica: Sabia que manter pequenas mudanças diárias pode acelerar os resultados?
                </p>
                <button
                  onClick={handleContinue}
                  className="mt-4 bg-rose-500 text-white px-4 py-2 rounded"
                >
                  Continuar
                </button>
              </div>
            ) : currentQuestion["last_step"] === "true" ? (
              <p className="mt-4 font-semibold">Obrigado por responder todas as questões!</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default WeightLossScreening;