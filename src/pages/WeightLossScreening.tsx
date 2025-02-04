import { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  pergunta: string;
  opcoes?: string[];
  'did-you-know'?: boolean;
  'last_step'?: boolean;
  'input_text'?: boolean;
}

const WeightLossScreening = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [userResponse, setUserResponse] = useState('');
  const [thread, setThread] = useState<any>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const initialized = useRef(false);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initializeChat();
    }
  }, []);

  const initializeChat = async () => {
    try {
      console.log('Iniciando chat...');
      
      const newThread = await openai.beta.threads.create();
      console.log('Thread criado:', newThread.id);
      setThread(newThread);

      const message = await openai.beta.threads.messages.create(newThread.id, {
        role: 'user',
        content: 'Qual é o seu objetivo no emagrecimento?'
      });
      console.log('Mensagem inicial enviada:', message.id);

      const run = await openai.beta.threads.runs.create(newThread.id, {
        assistant_id: 'asst_zkToAVTPc27XnTAvV5rCFPvv'
      });
      console.log('Run criado:', run.id);

      // Aguardar a primeira resposta com verificação
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        try {
          const initialRun = await openai.beta.threads.runs.retrieve(newThread.id, run.id);
          console.log('Status do run inicial:', initialRun.status);
          
          if (initialRun.status === 'completed') {
            const initialMessages = await openai.beta.threads.messages.list(newThread.id);
            const firstMessage = initialMessages.data[0];
            
            if (firstMessage?.role === 'assistant' && firstMessage.content?.length > 0) {
              const content = firstMessage.content[0];
              if (content?.type === 'text' && content.text?.value) {
                console.log('Primeira mensagem recebida:', content.text.value);
                try {
                  const parsedMessage = JSON.parse(content.text.value);
                  setMessages([parsedMessage]);
                  break;
                } catch (parseError) {
                  console.error('Erro ao parsear mensagem:', parseError);
                }
              }
            }
          } else if (initialRun.status === 'failed') {
            throw new Error(`Run inicial falhou: ${initialRun.last_error?.message || 'Erro desconhecido'}`);
          }
        } catch (runError) {
          console.error('Erro ao verificar status do run:', runError);
        }
        
        attempts++;
        if (attempts === maxAttempts) {
          throw new Error('Tempo limite excedido ao aguardar resposta inicial');
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao inicializar o chat:', error);
      setLoading(false);
    }
  };

  const waitForResponse = async (threadId: string, runId: string) => {
    try {
      const startTime = Date.now();
      let run = await openai.beta.threads.runs.retrieve(threadId, runId);
      console.log('Status inicial do run:', run.status);
      
      while (run.status === 'in_progress' || run.status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        run = await openai.beta.threads.runs.retrieve(threadId, runId);
        console.log('Novo status do run:', run.status);
        console.log('Tempo decorrido:', (Date.now() - startTime) / 1000, 'segundos');

        if (run.status === 'failed') {
          throw new Error(`Run falhou: ${run.last_error?.message || 'Erro desconhecido'}`);
        }
      }

      if (run.status === 'completed') {
        console.log('Run completado após:', (Date.now() - startTime) / 1000, 'segundos');
        const messages = await openai.beta.threads.messages.list(threadId);
        const lastMessage = messages.data[0];
        
        if (lastMessage?.role === 'assistant' && lastMessage.content?.length > 0) {
          const content = lastMessage.content[0];
          
          try {
            if (content?.type === 'text' && content.text?.value) {
              console.log('Mensagem recebida após:', (Date.now() - startTime) / 1000, 'segundos');
              console.log('Conteúdo da mensagem:', content.text.value);
              const parsedMessage = JSON.parse(content.text.value);
              
              setIsTransitioning(true);
              setTimeout(() => {
                setMessages([parsedMessage]);
                setIsTransitioning(false);
              }, 300);
            }
          } catch (error) {
            console.error('Erro ao parsear mensagem:', error);
          }
        } else {
          console.log('Mensagem não é do assistente ou está vazia:', lastMessage);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao aguardar resposta:', error);
      setLoading(false);
    }
  };

  const handleResponse = async (response: string) => {
    if (!thread || loading) return;
    
    const startTime = Date.now();
    setLoading(true);
    setUserResponse('');
    setIsTransitioning(true);
    console.log('Iniciando envio da resposta:', response);

    try {
      console.log('Enviando resposta do usuário:', response);
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: response
      });
      console.log('Resposta enviada após:', (Date.now() - startTime) / 1000, 'segundos');

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: 'asst_zkToAVTPc27XnTAvV5rCFPvv'
      });

      console.log('Run criado após:', (Date.now() - startTime) / 1000, 'segundos');
      
      await waitForResponse(thread.id, run.id);
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      setLoading(false);
      setIsTransitioning(false);
    }
  };

  const currentMessage = messages[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="ml-4 text-xl font-semibold text-gray-900">Triagem para Emagrecimento</h1>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 flex flex-col">
        {/* Messages */}
        <div className="flex-1 mb-4 relative">
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}`}>
            {currentMessage && (
              <div className="mb-6">
                {currentMessage['did-you-know'] ? (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 font-medium">Você sabia?</p>
                    <p className="text-blue-600">{currentMessage.pergunta}</p>
                    <button
                      onClick={() => handleResponse("Continuar")}
                      className="mt-4 w-full bg-blue-100 text-blue-800 p-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      disabled={loading}
                    >
                      Legal! Vamos continuar
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : currentMessage['last_step'] ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800">{currentMessage.pergunta}</p>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-900 font-medium mb-3">{currentMessage.pergunta}</p>
                    {currentMessage.opcoes && currentMessage.opcoes.map((opcao, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleResponse(opcao)}
                        className="w-full text-left p-3 mb-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        disabled={loading}
                      >
                        {opcao}
                      </button>
                    ))}
                    {currentMessage['input_text'] && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={userResponse}
                          onChange={(e) => setUserResponse(e.target.value)}
                          placeholder="Digite sua resposta..."
                          className="w-full p-3 border border-gray-200 rounded-lg"
                          onKeyPress={(e) => e.key === 'Enter' && userResponse.trim() && handleResponse(userResponse)}
                          disabled={loading}
                        />
                        <button
                          onClick={() => handleResponse(userResponse)}
                          className="mt-2 w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                          disabled={loading || !userResponse.trim()}
                        >
                          Enviar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightLossScreening;