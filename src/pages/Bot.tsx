import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, User, FileSpreadsheet, Sparkles, Home, Bot as BotIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const BotPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadedSheets, setLoadedSheets] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticação
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      navigate("/");
      return;
    }

    // Carregar planilhas do localStorage
    const sheets: string[] = [];
    for (let i = 0; i < 12; i++) {
      const data = localStorage.getItem(`sales_${i}`);
      if (data) {
        sheets.push(MONTHS[i]);
      }
    }
    setLoadedSheets(sheets);

    if (sheets.length === 0) {
      toast({
        title: "Nenhuma planilha carregada",
        description: "Faça upload das planilhas primeiro",
        variant: "destructive",
      });
    }
  }, [toast, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getAllSalesData = () => {
    const allData: any[] = [];
    for (let i = 0; i < 12; i++) {
      const data = localStorage.getItem(`sales_${i}`);
      if (data) {
        const parsed = JSON.parse(data);
        allData.push(...parsed.map((item: any) => ({ ...item, mes: MONTHS[i], mes_index: i + 1 })));
      }
    }
    return allData;
  };

  const getDataStructure = (data: any[]) => {
    if (data.length === 0) return "Sem dados disponíveis";
    const columns = Object.keys(data[0]);
    return `Colunas disponíveis: ${columns.join(", ")}`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const salesData = getAllSalesData();
      
      if (salesData.length === 0) {
        throw new Error("Nenhum dado disponível para análise");
      }

      console.log("Enviando dados para análise...");

      // Chamar a edge function
      const { data, error } = await supabase.functions.invoke("analyze-sales", {
        body: {
          question: input,
          salesData: salesData,
          loadedSheets: loadedSheets
        }
      });

      if (error) {
        console.error("Erro na edge function:", error);
        throw new Error(error.message || "Erro ao processar análise");
      }

      if (!data || !data.response) {
        throw new Error("Resposta inválida do servidor");
      }

      const aiResponse = data.response;
      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
      
      console.log("Análise concluída com sucesso");

    } catch (error) {
      console.error("Erro ao processar pergunta:", error);
      toast({
        title: "Erro na análise",
        description: error instanceof Error ? error.message : "Não foi possível processar sua pergunta",
        variant: "destructive",
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Header */}
      <header className="border-b border-border/50 glass-effect sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <BotIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">DataPulse AI</h1>
                <p className="text-xs text-muted-foreground">Assistente Inteligente</p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate("/home")}
              size="sm"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Início
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-6 py-6 flex gap-6 relative z-10 max-w-7xl">
        {/* Sidebar */}
        <aside className="w-64 space-y-4 hidden lg:block">
          <Card className="p-4 glass-effect border-border/50">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              Planilhas Ativas
            </h3>
            <div className="space-y-2">
              {loadedSheets.length > 0 ? (
                loadedSheets.map((month, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                    <div className="h-2 w-2 rounded-full bg-secondary shadow-glow animate-pulse" />
                    <span className="text-xs font-medium">{month}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Nenhuma planilha carregada</p>
              )}
            </div>
          </Card>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          <Card className="flex-1 glass-effect border-border/50 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-6 max-w-2xl animate-fade-in">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-glow animate-glow">
                      <Sparkles className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold">Como posso ajudar?</h2>
                    <p className="text-muted-foreground text-lg">
                      Faça perguntas sobre seus dados de vendas e receba insights inteligentes
                    </p>
                    <div className="grid md:grid-cols-3 gap-3 pt-6">
                      {[
                        { title: "Tendências", desc: "Padrões de vendas" },
                        { title: "Previsões", desc: "Resultados futuros" },
                        { title: "Estratégias", desc: "Recomendações" }
                      ].map((item, idx) => (
                        <Card key={idx} className="p-4 glass-effect hover-lift cursor-pointer border-border/50 group">
                          <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
                        <Sparkles className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground shadow-elegant"
                          : "glass-effect border border-border/50"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="h-8 w-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-accent-foreground" />
                      </div>
                    )}
                  </div>
                ))
              )}
              {loading && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
                    <Sparkles className="h-4 w-4 text-primary-foreground animate-pulse" />
                  </div>
                  <div className="glass-effect border border-border/50 rounded-2xl px-4 py-3">
                    <p className="text-sm font-medium">Analisando dados...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border/50 glass-effect">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Digite sua pergunta..."
                  disabled={loading || loadedSheets.length === 0}
                  className="h-11 rounded-xl bg-background/50 border-border/50"
                />
                <Button 
                  onClick={handleSend} 
                  disabled={loading || !input.trim() || loadedSheets.length === 0}
                  size="lg"
                  className="h-11 px-8 rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default BotPage;
