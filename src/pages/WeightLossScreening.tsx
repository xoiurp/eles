import React, { useState } from 'react';

interface Question {
  pergunta: string;
  opcoes?: string[];
  "did-you-know"?: boolean;
  "last_step"?: string;
  "input-text"?: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Answer {
  question: string;
  answer: string;
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

1. Ordem de Coleta de Dados:
   Primeiro, colete os dados básicos do paciente nesta ordem:
   - Idade
   - Peso atual (em kg)
   - Altura (em cm)
   
   Depois, prossiga com as outras informações.

2. Fluxo de Perguntas e Fatos Curiosos:
   - Faça 2 perguntas normais em sequência
   - Após cada 2 perguntas, apresente um fato curioso relacionado às respostas anteriores
   - Depois do fato curioso, continue com mais 2 perguntas
   - IMPORTANTE: Retorne apenas UM objeto JSON por resposta

3. Formato das Respostas:

Para perguntas de múltipla escolha (use sempre que possível):
{
  "pergunta": "Sua pergunta aqui",
  "opcoes": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"]
}

Para perguntas que precisam de dados numéricos (idade, peso, altura):
{
  "pergunta": "Qual é a sua idade?",
  "input-text": true
}

Para perguntas de detalhamento (use APENAS após uma resposta positiva em múltipla escolha):
Exemplo:
1. Primeiro pergunte: "Você faz uso de algum medicamento?"
   {
     "pergunta": "Você faz uso de algum medicamento?",
     "opcoes": ["Sim", "Não"]
   }

2. Se a resposta for "Sim", então peça detalhes:
   {
     "pergunta": "Por favor, liste os medicamentos que você utiliza:",
     "input-text": true
   }

Para fatos curiosos (use após cada 2 perguntas):
{
  "pergunta": "Fato interessante baseado nas respostas anteriores",
  "opcoes": [],
  "did-you-know": true
}

Para finalizar:
{
  "pergunta": "Mensagem de agradecimento",
  "opcoes": [],
  "last_step": "true"
}

4. Informações a Coletar:
- Dados básicos (idade, peso, altura)
- Objetivo no emagrecimento
- Histórico de tentativas de perda de peso
- Condições médicas relevantes
- Uso atual de medicamentos (use múltipla escolha + input-text se necessário)
- Histórico familiar
- Nível de atividade física
- Hábitos alimentares
- Expectativas quanto ao tratamento
- Preocupações sobre medicamentos

5. Regras Importantes:
- Comece SEMPRE com idade, peso e altura
- Use preferencialmente perguntas de múltipla escolha
- Use input-text APENAS para:
  * Dados numéricos (idade, peso, altura)
  * Detalhamento após resposta "Sim" em perguntas de múltipla escolha
- Não repita perguntas já feitas
- Atue como um profissional de saúde experiente
- Baseie os fatos curiosos nas respostas anteriores do usuário
- Retorne apenas UM objeto JSON por resposta, sem texto adicional

IMPORTANTE: Retorne apenas UM objeto JSON por resposta, sem texto adicional.`;

function WeightLossScreening() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(fallbackChain[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set([fallbackChain[0].pergunta]));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [textInput, setTextInput] = useState<string>('');
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Determina o endpoint baseado no ambiente
  const API_ENDPOINT = import.meta.env.PROD 
    ? 'https://eles-saude-masc.netlify.app/.netlify/functions/claude-proxy'
    : '/.netlify/functions/claude-proxy';

  const getNextQuestionFromClaude = async (answer: string): Promise<Question | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // Adicionar a resposta atual ao histórico
      const newAnswers = [...answers, { question: currentQuestion.pergunta, answer }];
      setAnswers(newAnswers);

      const updatedMessages: Message[] = [
        { role: 'user', content: SYSTEM_PROMPT },
        ...messages,
        { 
          role: 'user', 
          content: `Histórico completo de perguntas e respostas:
          ${newAnswers.map(a => `Pergunta: ${a.question}
          Resposta: ${a.answer}`).join('\n')}
          
          Perguntas já feitas: ${Array.from(askedQuestions).join(", ")}.
          Última resposta do usuário para a pergunta "${currentQuestion.pergunta}": ${answer}.
          Número de perguntas feitas desde o último fato curioso: ${questionCount % 2}
          
          IMPORTANTE: Retorne apenas UM objeto JSON. Se já foram feitas 2 perguntas desde o último fato curioso, retorne um fato curioso baseado nas respostas anteriores. Após o fato curioso, continue o fluxo de perguntas normalmente.` 
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

          // Atualizar contador de perguntas apenas para perguntas normais (não fatos curiosos)
          if (!parsed["did-you-know"]) {
            setQuestionCount(prev => prev + 1);
          } else {
            setQuestionCount(0); // Resetar contador após mostrar fato curioso
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
        setTextInput(''); // Limpar input de texto ao mudar de pergunta
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
    // Tratar o botão "Continuar" como uma resposta normal
    handleOptionSelect("Entendi");
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
            {currentQuestion.opcoes && currentQuestion.opcoes.length > 0 ? (
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
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full p-2 border rounded resize-none"
                    rows={4}
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
            ) : currentQuestion["last_step"] === "true" ? (
              <p className="mt-4 font-semibold">{currentQuestion.pergunta}</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default WeightLossScreening;