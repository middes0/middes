export async function onRequestPost(context) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=UTF-8"
  };

  try {
    const body = await context.request.json();
    const question = typeof body?.question === "string" ? body.question.trim() : "";
    const history = Array.isArray(body?.history) ? body.history.slice(-8) : [];
    const catalog = Array.isArray(body?.catalog) ? body.catalog.slice(0, 30) : [];

    if (!question) {
      return new Response(JSON.stringify({ error: "Digite uma pergunta." }), { status: 400, headers: cors });
    }

    if (!context.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "A CentralAI ainda não foi configurada no Cloudflare. Adicione o secret OPENAI_API_KEY." }), { status: 500, headers: cors });
    }

    const catalogText = catalog.map(p => {
      const specs = Array.isArray(p.specs) ? p.specs.map(s => `${s[0]}: ${s[1]}`).join("; ") : "";
      return `${p.name} | categoria: ${p.category} | preço: ${p.price} | fabricante: ${p.brand} | descrição: ${p.description} | especificações: ${specs}`;
    }).join("\n");

    const input = [
      ...history.filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"),
      { role: "user", content: question }
    ];

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        instructions: `Você é a CentralAI, assistente virtual da loja CentralMarket. Responda sempre em português do Brasil, de forma clara, natural e objetiva. Ajude o visitante a entender produtos, comparar especificações, encontrar categorias e navegar pela loja. Use somente os dados do catálogo fornecido para afirmar detalhes específicos de produtos, preços, fabricantes e especificações. Se algo não estiver no catálogo, diga que essa informação não está disponível. Não invente estoque, prazo de entrega, garantia, avaliações ou características. Você pode recomendar produtos com base no que a pessoa pediu, mas explique brevemente o motivo. Se perguntarem sobre pagamento, explique que o site possui uma página de checkout demonstrativa. Nunca peça, receba ou repita dados completos de cartão, senhas ou chaves de API.\n\nCATÁLOGO ATUAL DO CENTRALMARKET:\n${catalogText}`,
        input,
        max_output_tokens: 500
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data?.error?.message || "Não foi possível obter uma resposta da IA." }), { status: 502, headers: cors });
    }

    const answer = data?.output_text || data?.output?.flatMap(x => x.content || []).find(x => x.type === "output_text")?.text || "Não consegui gerar uma resposta agora.";
    return new Response(JSON.stringify({ answer }), { status: 200, headers: cors });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao processar a pergunta." }), { status: 500, headers: cors });
  }
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    }
  });
}
