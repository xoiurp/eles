import { Context } from '@netlify/functions'

export default async (request: Request, context: Context) => {
  // Configurar CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, OpenAI-Beta',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    const { path, method, headers = {}, body: requestBody } = body

    // Construir a URL completa da API OpenAI
    const url = `https://api.openai.com/v1${path}`

    // Fazer a requisição para a API OpenAI
    const response = await fetch(url, {
      method: method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': headers['OpenAI-Beta'] || 'assistants=v2'
      },
      body: requestBody ? JSON.stringify(requestBody) : undefined
    })

    // Obter o corpo da resposta
    const data = await response.json()

    // Retornar a resposta para o cliente
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  } catch (error) {
    console.error('Erro na função:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  }
}
