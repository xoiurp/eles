import { Context } from '@netlify/functions'

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

    // Fazer a requisição para a API do Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 4096,
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7
      })
    })

    const data = await response.json()
    console.log('Resposta do Claude:', JSON.stringify(data, null, 2))

    // Verificar se há erro na resposta
    if (!response.ok) {
      throw new Error(`Claude API error: ${JSON.stringify(data)}`)
    }

    // Verificar se a resposta tem o formato esperado
    if (!data.content?.[0]?.text) {
      console.error('Resposta inesperada do Claude:', data);
      throw new Error(`Resposta em formato inválido: ${JSON.stringify(data)}`);
    }

    // Extrair e limpar o texto da resposta
    let responseText = data.content[0].text;
    console.log('Texto original da resposta:', responseText);
    
    // Remover possíveis marcadores de código e espaços em branco
    responseText = responseText.replace(/```json\s*|\s*```/g, '').trim();
    console.log('Texto após limpeza:', responseText);

    // Função para extrair o primeiro objeto JSON válido
    const extractFirstJsonObject = (text: string): string => {
      let depth = 0;
      let start = text.indexOf('{');
      if (start === -1) return '';

      for (let i = start; i < text.length; i++) {
        if (text[i] === '{') depth++;
        if (text[i] === '}') {
          depth--;
          if (depth === 0) {
            return text.substring(start, i + 1);
          }
        }
      }
      return '';
    };
    
    // Extrair o primeiro objeto JSON válido
    const firstJsonObject = extractFirstJsonObject(responseText);
    console.log('Primeiro objeto JSON extraído:', firstJsonObject);
    
    // Tentar parsear para garantir que é um JSON válido
    try {
      const parsedJson = JSON.parse(firstJsonObject);
      console.log('JSON parseado com sucesso:', parsedJson);

      // Verificar se tem as propriedades necessárias
      if (!parsedJson.pergunta || (!parsedJson["did-you-know"] && !parsedJson["last_step"] && !parsedJson["input-text"] && !Array.isArray(parsedJson.opcoes))) {
        throw new Error('JSON não contém as propriedades necessárias');
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
    } catch (error) {
      console.error('Erro ao parsear JSON:', error);
      console.error('Texto que causou o erro:', firstJsonObject);
      
      // Retornar erro com mais detalhes
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        details: 'Erro ao parsear resposta do Claude',
        rawResponse: responseText,
        firstJsonObject,
        parseError: error instanceof Error ? error.message : 'Unknown parse error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }
  } catch (error) {
    console.error('Erro na função:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  }
}