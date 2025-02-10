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
        model: 'claude-3-sonnet-20240229',
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

    // Extrair e limpar o texto da resposta
    let responseText = data.content?.[0]?.text || '';
    
    // Remover possíveis marcadores de código e espaços em branco
    responseText = responseText.replace(/```json\s*|\s*```/g, '').trim();
    
    // Tentar parsear para garantir que é um JSON válido
    try {
      JSON.parse(responseText);
    } catch (error) {
      console.error('JSON inválido recebido do Claude:', responseText);
      throw new Error('Resposta inválida do Claude');
    }

    // Formatar a resposta final
    const formattedResponse = {
      content: [{
        type: 'text',
        text: {
          value: responseText,
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