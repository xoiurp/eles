import React, { useState, useEffect } from 'react';

interface Question {
  pergunta: string;
  opcoes: string[];
  "did-you-know"?: boolean;
  "last_step"?: string;
  "input-text"?: string;
}

interface RunStatus {
  id: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'expired';
}

interface AssistantMessage {
  role: string;
  content: Array<{
    type: string;
    text: {
      value: string;
      annotations: any[];
    };
  }>;
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
  }
];

function WeightLossScreening() {
  const [step, setStep] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(fallbackChain[0]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);

  // Função auxiliar para fazer requisições através do proxy
  const proxyFetch = async (path: string, method: string = 'POST', body?: any, headers: any = {}) => {
    const response = await fetch('/.netlify/functions/openai-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        method,
        body,
        headers
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  // Função para aguardar o run completar
  const waitForRunCompletion = async (thread: string, runId: string): Promise<boolean> => {
    const maxAttempts = 30;
    const delayMs = 1000;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const status = await checkRunStatus(thread, runId);
        console.log(`Tentativa ${attempts + 1}: Status do run:`, status?.status);
        
        if (!status) return false;

        if (status.status === 'completed') {
          setCurrentRunId(null);
          return true;
        } else if (status.status === 'failed' || status.status === 'cancelled' || status.status === 'expired') {
          setCurrentRunId(null);
          return false;
        }

        await new Promise(resolve => setTimeout(resolve, delayMs));
        attempts++;
      } catch (error) {
        console.error(`Erro na tentativa ${attempts + 1}:`, error);
        return false;
      }
    }

    setCurrentRunId(null);
    return false;
  };

  // Cria um thread se não existir
  const createThread = async (): Promise<string | null> => {
    try {
      const data = await proxyFetch('/threads');
      console.log("Thread criado:", data);
      return data.id;
    } catch (error) {
      console.error("Erro ao criar thread:", error);
      return null;
    }
  };

  // Adiciona uma mensagem do usuário ao thread
  const addMessage = async (thread: string, answer: string): Promise<boolean> => {
    try {
      if (currentRunId) {
        console.log("Aguardando run atual terminar...");
        const completed = await waitForRunCompletion(thread, currentRunId);
        if (!completed) {
          console.log("Run anterior não completou com sucesso");
          return false;
        }
      }

      const data = await proxyFetch(`/threads/${thread}/messages`, 'POST', {
        role: "user",
        content: `Histórico de perguntas já feitas: ${conversationHistory.join(", ")}. 
          Última resposta do usuário para a pergunta "${currentQuestion.pergunta}": ${answer}.
          
          Por favor, faça a próxima pergunta da triagem, seguindo estas regras:
          1. NÃO repita nenhuma das perguntas já feitas listadas acima
          2. Retorne APENAS um JSON com as chaves 'pergunta' e 'opcoes'
          3. A cada 2 perguntas, inclua um fato curioso com a flag 'did-you-know': true
          4. Mantenha as perguntas relevantes para uma triagem de emagrecimento, como:
             - Rotina diária
             - Hábitos alimentares
             - Histórico de saúde
             - Objetivos específicos
             - Restrições alimentares
             - Horários das refeições
             - Consumo de água
             - Qualidade do sono
          5. Forneça sempre opções de múltipla escolha claras e objetivas
          
          Exemplo de resposta esperada:
          {
            "pergunta": "Qual sua frequência de atividade física semanal?",
            "opcoes": ["Nenhuma", "1-2 vezes", "3-4 vezes", "5 ou mais vezes"]
          }`
      });

      console.log("Mensagem adicionada:", data);
      return !data.error;
    } catch (error) {
      console.error("Erro ao adicionar mensagem:", error);
      return false;
    }
  };

  // Cria um Run para processar a thread
  const runAssistant = async (thread: string): Promise<string | null> => {
    try {
      const data = await proxyFetch(`/threads/${thread}/runs`, 'POST', {
        assistant_id: "asst_zkToAVTPc27XnTAvV5rCFPvv",
        instructions: `Você é o assistente virtual de um centro médico especializado em emagrecimento. 
          Realize a triagem inicial de forma objetiva, retornando um JSON com a chave 'pergunta' e as opções na chave 'opcoes'.
          Não repita as seguintes perguntas já feitas: ${conversationHistory.join(", ")}.
          A cada 2 perguntas, inclua um fato curioso com a flag 'did-you-know': true.
          IMPORTANTE: Retorne apenas o JSON, sem nenhum texto adicional.`
      });

      console.log("Run criado:", data);
      if (data.id && !data.error) {
        setCurrentRunId(data.id);
        return data.id;
      }
      return null;
    } catch (error) {
      console.error("Erro ao executar o run:", error);
      return null;
    }
  };

  // Verifica o status do run
  const checkRunStatus = async (thread: string, runId: string): Promise<RunStatus | null> => {
    try {
      const data = await proxyFetch(`/threads/${thread}/runs/${runId}`, 'GET');
      return data;
    } catch (error) {
      console.error("Erro ao verificar status do run:", error);
      return null;
    }
  };

  // Busca as mensagens do thread e extrai a última mensagem do assistente
  const fetchAssistantResponse = async (thread: string): Promise<Question | null> => {
    try {
      const data = await proxyFetch(`/threads/${thread}/messages`, 'GET');
      console.log("Mensagens recebidas:", data);
      const messages = data.data;
      const assistantMessages = messages.filter((msg: AssistantMessage) => msg.role === "assistant");
      
      if (assistantMessages.length > 0) {
        const lastMessage = assistantMessages[assistantMessages.length - 1];
        if (lastMessage.content[0]?.type === "text") {
          const jsonString = lastMessage.content[0].text.value;
          const cleanJson = jsonString.replace(/```json\n?|\n?```/g, '').trim();
          try {
            const parsed = JSON.parse(cleanJson) as Question;
            if (!conversationHistory.includes(parsed.pergunta)) {
              setConversationHistory(prev => [...prev, parsed.pergunta]);
              return parsed;
            } else {
              console.log("Pergunta repetida detectada:", parsed.pergunta);
              return null;
            }
          } catch (parseError) {
            console.error("Erro ao parsear resposta do assistant:", parseError, cleanJson);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
    return null;
  };

  const getNextQuestionFromAPI = async (answer: string): Promise<Question | null> => {
    setIsLoading(true);
    try {
      let currentThread = threadId;
      if (!currentThread) {
        currentThread = await createThread();
        if (currentThread) {
          setThreadId(currentThread);
        } else {
          console.log("Falha ao criar thread, usando fallback");
          return fallbackChain[step + 1];
        }
      }

      const messageAdded = await addMessage(currentThread, answer);
      if (!messageAdded) {
        console.log("Falha ao adicionar mensagem, usando fallback");
        return fallbackChain[step + 1];
      }

      const runId = await runAssistant(currentThread);
      if (!runId) {
        console.log("Falha ao criar run, usando fallback");
        return fallbackChain[step + 1];
      }

      const runCompleted = await waitForRunCompletion(currentThread, runId);
      if (!runCompleted) {
        console.log("Run não completou, usando fallback");
        return fallbackChain[step + 1];
      }

      const response = await fetchAssistantResponse(currentThread);
      if (!response) {
        console.log("Resposta inválida ou repetida, usando fallback");
        return fallbackChain[step + 1];
      }
      return response;
    } catch (error) {
      console.error("Erro ao obter próxima pergunta:", error);
      return fallbackChain[step + 1];
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = async (answer: string) => {
    setAnswers(prev => [...prev, answer]);
    const apiQuestion = await getNextQuestionFromAPI(answer);
    if (apiQuestion) {
      setCurrentQuestion(apiQuestion);
    } else {
      const nextStep = step + 1;
      if (nextStep < fallbackChain.length) {
        setStep(nextStep);
        setCurrentQuestion(fallbackChain[nextStep]);
      }
    }
  };

  const handleContinue = () => {
    const nextStep = step + 1;
    if (nextStep < fallbackChain.length) {
      setStep(nextStep);
      setCurrentQuestion(fallbackChain[nextStep]);
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