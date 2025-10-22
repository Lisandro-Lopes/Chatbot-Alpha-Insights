import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Upload, BarChart3, TrendingUp, Database, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar autenticação
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
      
      <header className="border-b border-border/50 glass-effect sticky top-0 z-50 shimmer">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Sparkles className="h-6 w-6 text-primary-foreground animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">DataPulse Analytics</h1>
                <p className="text-sm text-muted-foreground mt-1">Inteligência Comercial Avançada</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto space-y-20 animate-fade-in">
          <section className="text-center space-y-8">
            <div className="inline-flex h-28 w-28 items-center justify-center rounded-3xl gradient-primary mb-6 shadow-glow animate-glow floating">
              <Zap className="h-14 w-14 text-primary-foreground" />
            </div>
            <h2 className="text-6xl md:text-8xl font-bold leading-tight animate-slide-up">
              Analista de Vendas -{" "}
              <span className="text-gradient">Alpha Insights</span>
            </h2>
            <p className="text-xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Converta dados brutos em estratégias vencedoras através de análises preditivas e recomendações personalizadas
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg" 
                onClick={() => navigate("/upload")} 
                className="shadow-elegant text-lg px-10 py-7 rounded-2xl group"
              >
                <Upload className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                Upload de Planilhas
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/bot")}
                className="border-2 text-lg px-10 py-7 rounded-2xl group"
              >
                <Zap className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                Acessar Assistente
              </Button>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-8">
            <Card className="p-10 gradient-card shadow-elegant interactive-card group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Upload className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-foreground">Importação Automatizada</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Conecte e sincronize suas planilhas anuais com processamento instantâneo e validação em tempo real
                </p>
              </div>
            </Card>

            <Card className="p-10 gradient-card shadow-elegant interactive-card group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors" />
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl gradient-secondary flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <BarChart3 className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-foreground">Processamento Cognitivo</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Motor de IA processa consultas complexas e identifica padrões ocultos através de deep learning
                </p>
              </div>
            </Card>

            <Card className="p-10 gradient-card shadow-elegant interactive-card group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <TrendingUp className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-foreground">Recomendações Inteligentes</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Obtenha sugestões estratégicas personalizadas com previsões de tendência e análise preditiva
                </p>
              </div>
            </Card>
          </section>

          <section className="glass-effect rounded-3xl p-12 md:p-20 border border-border/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
            <div className="max-w-5xl mx-auto text-center space-y-10 relative">
              <div className="inline-flex p-5 bg-primary/10 rounded-3xl shadow-glow floating">
                <Database className="h-20 w-20 text-primary" />
              </div>
              <h3 className="text-5xl md:text-6xl font-bold text-foreground">Estrutura de Dados</h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Cada planilha deve conter as seguintes colunas para análise completa:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                {["Data", "ID_Transacao", "Produto", "Categoria", "Região", "Quantidade", "Preço_Unitário", "Receita_Total", "Nome_Cliente", "Vendedor"].map((col, idx) => (
                  <div 
                    key={col} 
                    className="glass-effect px-5 py-4 rounded-2xl border border-border/50 hover:border-primary/50 hover:scale-105 transition-all font-semibold text-sm hover:shadow-glow"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {col}
                  </div>
                ))}
              </div>
              <p className="text-lg text-muted-foreground pt-6">
                📊 Formatos aceitos: .xlsx, .xls, .csv | ✨ Mínimo: 200 linhas por planilha
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-border/50 mt-24 py-10 relative z-10">
        <div className="container mx-auto px-4 text-center text-base text-muted-foreground">
          <p>&copy; 2024 DataPulse Analytics - Plataforma de Inteligência Comercial</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
