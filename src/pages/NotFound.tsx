import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="text-center space-y-6 animate-fade-in">
        <h1 className="text-7xl font-bold text-gradient animate-glow">404</h1>
        <p className="text-2xl text-muted-foreground">Página não encontrada</p>
        <a href="/" className="inline-block">
          <button className="px-8 py-3 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            Retornar ao Início
          </button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
