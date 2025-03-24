import { Context } from '@netlify/functions'

// Declare the Node.js process globally to avoid TypeScript errors
declare global {
  var process: {
    env: {
      [key: string]: string | undefined;
    };
  };
}

// Função para criar um AbortController com timeout
const createAbortControllerWithTimeout = (timeoutMs: number) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  return {
    controller,
    clear: () => clearTimeout(timeout)
  };
};

// Template de resposta fallback para quando houver um erro
const createFallbackQuestion = (message: string) => {
  return {
    pergunta: `Ocorreu um erro na comunicação com o assistente. ${message} Por favor, tente novamente.`,
    opcoes: ["Tentar novamente"],
    "error_recovery": true
  };
};

export default async (request: Request, context: Context) => {
  // Configurar CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Lidar com requisições OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    if (request.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const body = await request.json()
    const { messages } = body

    console.log('Requisição recebida:', JSON.stringify(messages, null, 2))

    // Configurar timeout para a requisição (25 segundos)
    const { controller, clear: clearTimeout } = createAbortControllerWithTimeout(25000);
    
    let data;
    let responseText;
    
    try {
      // Fazer a requisição para a API da Openrouter com timeout
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://eles-saude-masc.netlify.app/',
          'X-Title': 'Triagem Emagrecimento'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet-20240620',
          messages: messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
          max_tokens: 4000
        }),
        signal: controller.signal
      });
      
      // Limpar o timeout já que a requisição foi concluída
      clearTimeout();

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Erro na resposta da Openrouter:', errorData)
        throw new Error(`Openrouter API error: ${errorData}`)
      }

      data = await response.json()
      console.log('Resposta da Openrouter:', JSON.stringify(data, null, 2))

      // Verificar se a resposta tem o formato esperado
      if (!data.choices?.[0]?.message?.content) {
        console.error('Resposta inesperada da Openrouter:', data)
        throw new Error('Resposta em formato inválido')
      }

      // Extrair e limpar o texto da resposta
      responseText = data.choices[0].message.content
      console.log('Texto original da resposta:', responseText)
    } catch (apiError) {
      console.error('Erro ao fazer requisição para a API:', apiError);
      
      // Criar uma resposta de fallback quando a API falhar
      const fallbackJson = JSON.stringify(createFallbackQuestion(
        apiError instanceof Error 
          ? apiError.message.substring(0, 100) // Limitar o tamanho da mensagem de erro
          : 'Erro desconhecido ao conectar com o serviço.'
      ));
      
      // Formatar a resposta de fallback
      const fallbackResponse = {
        content: [{
          type: 'text',
          text: {
            value: fallbackJson,
            annotations: []
          }
        }]
      };
      
      return new Response(JSON.stringify(fallbackResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Remover possíveis marcadores de código e espaços em branco
    responseText = responseText.replace(/```json\s*|\s*```/g, '').trim()
    console.log('Texto após limpeza:', responseText)

    // Função para extrair o primeiro objeto JSON válido
    const extractFirstJsonObject = (text: string): string => {
      try {
        // Primeiro, tenta parsear o texto inteiro
        JSON.parse(text)
        return text
      } catch {
        // Se falhar, tenta extrair o primeiro objeto JSON válido
        let depth = 0
        let start = text.indexOf('{')
        if (start === -1) {
          console.error('Nenhum objeto JSON encontrado no texto:', text)
          throw new Error('Nenhum objeto JSON encontrado na resposta')
        }

        for (let i = start; i < text.length; i++) {
          if (text[i] === '{') depth++
          if (text[i] === '}') {
            depth--
            if (depth === 0) {
              const jsonCandidate = text.substring(start, i + 1)
              try {
                // Verifica se é um JSON válido
                JSON.parse(jsonCandidate)
                return jsonCandidate
              } catch {
                continue // Se não for válido, continua procurando
              }
            }
          }
        }
        throw new Error('Nenhum objeto JSON válido encontrado na resposta')
      }
    }
    
    try {
      // Extrair e validar o JSON
      const firstJsonObject = extractFirstJsonObject(responseText)
      console.log('JSON extraído:', firstJsonObject)
      
      // Parsear e validar a estrutura
      const parsedJson = JSON.parse(firstJsonObject)
      console.log('JSON parseado:', parsedJson)

      // Validação mais detalhada da estrutura
      if (!parsedJson.pergunta) {
        throw new Error('JSON não contém a propriedade obrigatória "pergunta"')
      }

      // Validar que pelo menos uma das propriedades necessárias está presente
      const hasValidStructure = 
        parsedJson["did-you-know"] !== undefined ||
        parsedJson["last_step"] !== undefined ||
        parsedJson["input-text"] !== undefined ||
        Array.isArray(parsedJson.opcoes)

      if (!hasValidStructure) {
        console.error('Estrutura JSON inválida:', parsedJson)
        throw new Error('JSON não contém uma estrutura válida para pergunta')
      }

      // Formatar a resposta final
      const formattedResponse = {
        content: [{
          type: 'text',
          text: {
            value: firstJsonObject,
            annotations: []
          }
        }]
      }

      return new Response(JSON.stringify(formattedResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    } catch (jsonError) {
      console.error('Erro ao processar JSON:', jsonError);
      
      // Criar uma resposta de fallback quando o processamento de JSON falhar
      const fallbackJson = JSON.stringify(createFallbackQuestion(
        jsonError instanceof Error 
          ? 'Erro na formatação da resposta: ' + jsonError.message.substring(0, 100)
          : 'Erro desconhecido ao processar a resposta.'
      ));
      
      // Formatar a resposta de fallback
      const fallbackResponse = {
        content: [{
          type: 'text',
          text: {
            value: fallbackJson,
            annotations: []
          }
        }]
      };
      
      return new Response(JSON.stringify(fallbackResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  } catch (error) {
    console.error('Erro na função:', error)
    
    try {
      // Criar uma resposta de fallback para qualquer erro não capturado
      const fallbackJson = JSON.stringify(createFallbackQuestion(
        error instanceof Error 
          ? error.message.substring(0, 100) 
          : 'Ocorreu um erro não identificado.'
      ));
      
      // Tentar retornar uma resposta bem formatada mesmo em caso de erro
      return new Response(JSON.stringify({
        content: [{
          type: 'text',
          text: {
            value: fallbackJson,
            annotations: []
          }
        }]
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch {
      // Último recurso - se tudo mais falhar, retorna um erro básico
      const errorResponse = {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        path: request.url
      }

      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
}
