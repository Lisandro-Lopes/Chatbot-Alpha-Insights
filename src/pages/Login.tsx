import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // Verificar se já está logado
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && !name) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, preencha seu nome",
        variant: "destructive",
      });
      return;
    }

    // Simular autenticação
    if (isLogin) {
      // Login
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast({
          title: "Login realizado!",
          description: `Bem-vindo de volta, ${user.name}!`,
        });
        navigate("/home");
      } else {
        toast({
          title: "Credenciais inválidas",
          description: "Email ou senha incorretos",
          variant: "destructive",
        });
      }
    } else {
      // Cadastro
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Verificar se já existe
      if (users.some((u: any) => u.email === email)) {
        toast({
          title: "Email já cadastrado",
          description: "Este email já está em uso",
          variant: "destructive",
        });
        return;
      }

      // Criar novo usuário
      const newUser = { email, password, name };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      
      toast({
        title: "Conta criada!",
        description: `Bem-vindo, ${name}!`,
      });
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5" />
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-gradient">DataPulse</span>
            </div>
            
            <div className="space-y-6 mt-20">
              <h1 className="text-6xl font-bold leading-tight">
                Transforme<br />
                <span className="text-gradient">Dados em Decisões</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Análise inteligente de vendas com IA para impulsionar seus resultados
              </p>
            </div>

            <div className="space-y-4 mt-16">
              {[
                { icon: TrendingUp, text: "Previsões em tempo real" },
                { icon: Sparkles, text: "Insights automatizados" },
                { icon: TrendingUp, text: "ROI 10x superior" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${idx * 0.2}s` }}>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            © 2024 DataPulse Analytics. Todos os direitos reservados.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center space-y-3">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-gradient">DataPulse Analytics</h1>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-bold">
                {isLogin ? "Bem-vindo de volta" : "Criar sua conta"}
              </h2>
              <p className="text-muted-foreground text-lg">
                {isLogin ? "Entre para acessar sua plataforma" : "Comece sua jornada de insights"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome completo</label>
                  <Input 
                    type="text" 
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-11 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-11 pr-11 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Lembrar-me</span>
                  </label>
                  <button type="button" className="text-sm text-primary hover:underline">
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12 rounded-xl text-base group"
              >
                {isLogin ? "Entrar" : "Criar conta"}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-primary font-semibold hover:underline"
                >
                  {isLogin ? "Criar conta" : "Fazer login"}
                </button>
              </p>
              
              {isLogin && (
                <p className="text-xs text-muted-foreground pt-4">
                  Ao entrar, você concorda com nossos Termos e Política de Privacidade
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
