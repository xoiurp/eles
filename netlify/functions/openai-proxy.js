const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Apenas permitir requisições POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { path, method, body, headers } = JSON.parse(event.body);
    
    // Construir a URL completa da API OpenAI
    const url = `https://api.openai.com/v1${path}`;
    
    // Fazer a requisição para a API OpenAI
    const response = await fetch(url, {
      method: method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': headers['OpenAI-Beta'] || 'assistants=v2'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    // Obter o corpo da resposta
    const data = await response.json();

    // Retornar a resposta para o cliente
    return {
      statusCode: response.status,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Em produção, especifique o domínio exato
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      }
    };
  } catch (error) {
    console.error('Erro na função:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};