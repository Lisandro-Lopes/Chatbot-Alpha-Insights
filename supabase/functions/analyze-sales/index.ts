import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, salesData, loadedSheets } = await req.json();

    if (!question || !salesData || salesData.length === 0) {
      throw new Error("Dados insuficientes para análise");
    }

    console.log(`Processing question: ${question}`);
    console.log(`Sales data records: ${salesData.length}`);

    // Preparar contexto dos dados
    const dataStructure = Object.keys(salesData[0]).join(", ");
    
    // Amostrar dados de todos os meses de forma uniforme
    const samplePerMonth = Math.floor(500 / loadedSheets.length);
    const dataToSend: any[] = [];
    
    for (let i = 1; i <= 12; i++) {
      const monthData = salesData.filter((item: any) => item.mes_index === i);
      if (monthData.length > 0) {
        // Pegar amostra representativa de cada mês
        const sample = monthData.slice(0, Math.max(samplePerMonth, 10));
        dataToSend.push(...sample);
      }
    }

    // Chamar Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Você é um analista de dados especializado em vendas. Você TEM CAPACIDADE de processar e analisar dados JSON.

**INSTRUÇÕES CRÍTICAS:**
1. Você DEVE processar os dados JSON fornecidos
2. Você PODE e DEVE fazer cálculos matemáticos (somas, médias, porcentagens)
3. Analise os dados reais, NÃO use placeholders como "R$ X"
4. Forneça números específicos e exatos
5. Use a coluna que representa valor/receita para cálculos financeiros
6. Use a coluna "mes" para agrupar por mês

**FORMATO DE RESPOSTA:**
- Números reais e específicos
- Mostre cálculos quando relevante
- Seja direto e objetivo
- Inclua insights acionáveis`
          },
          {
            role: "user",
            content: `**DADOS DE VENDAS (formato JSON):**
${JSON.stringify(dataToSend, null, 2)}

**INFORMAÇÕES:**
- Total de transações: ${salesData.length}
- Meses com dados: ${loadedSheets.join(", ")}
- Colunas: ${dataStructure}

**PERGUNTA:** ${question}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("Resposta vazia da IA");
    }

    console.log("Analysis completed successfully");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in analyze-sales:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erro ao processar análise" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
