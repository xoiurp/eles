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

    // Fazer a requisição para a API da Openrouter
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
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Erro na resposta da Openrouter:', errorData)
      throw new Error(`Openrouter API error: ${errorData}`)
    }

    const data = await response.json()
    console.log('Resposta da Openrouter:', JSON.stringify(data, null, 2))

    // Verificar se a resposta tem o formato esperado
    if (!data.choices?.[0]?.message?.content) {
      console.error('Resposta inesperada da Openrouter:', data)
      throw new Error('Resposta em formato inválido')
    }

    // Extrair e limpar o texto da resposta
    let responseText = data.choices[0].message.content
    console.log('Texto original da resposta:', responseText)
    
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
  } catch (error) {
    console.error('Erro na função:', error)
    
    // Criar uma resposta de erro mais detalhada
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
    })
  }
}